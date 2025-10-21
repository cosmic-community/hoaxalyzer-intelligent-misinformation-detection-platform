from celery import Celery
import os
from dotenv import load_dotenv
from services.scraper import scrape_article
from services.twitter_crawler import crawl_topic
from services.preprocessor import preprocess_text
from models.nlp_pipeline import NLPPipeline
from database.crud import (
    create_analysis_job,
    update_job_status,
    save_analysis_results
)

load_dotenv()

# Initialize Celery
celery_app = Celery(
    'hoaxalyzer',
    broker=os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0'),
    backend=os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
)

celery_app.conf.task_routes = {
    'celery_worker.analyze_url_task': {'queue': 'analysis'},
    'celery_worker.analyze_topic_task': {'queue': 'analysis'},
}

# Initialize NLP Pipeline
nlp_pipeline = NLPPipeline()

@celery_app.task(name='celery_worker.analyze_url_task')
def analyze_url_task(job_id: str, url: str):
    """
    Celery task for analyzing a single URL.
    """
    try:
        # Create job record
        create_analysis_job(job_id, 'url', url)
        update_job_status(job_id, 'processing', 10)
        
        # Step 1: Scrape article
        article_data = scrape_article(url)
        if not article_data:
            update_job_status(job_id, 'failed', 0)
            return
        
        update_job_status(job_id, 'processing', 30)
        
        # Step 2: Preprocess text
        cleaned_text = preprocess_text(article_data['content'])
        update_job_status(job_id, 'processing', 50)
        
        # Step 3: Run NLP analysis
        sentiment_result = nlp_pipeline.analyze_sentiment(cleaned_text)
        update_job_status(job_id, 'processing', 70)
        
        hoax_result = nlp_pipeline.classify_hoax(cleaned_text)
        update_job_status(job_id, 'processing', 85)
        
        explainability = nlp_pipeline.explain_classification(
            cleaned_text, 
            hoax_result
        )
        update_job_status(job_id, 'processing', 95)
        
        # Step 4: Save results
        results = {
            'job_id': job_id,
            'query_type': 'url',
            'query_input': url,
            'status': 'completed',
            'overall_sentiment': sentiment_result['label'],
            'sentiment_breakdown': {
                'positive': 1 if sentiment_result['label'] == 'positive' else 0,
                'negative': 1 if sentiment_result['label'] == 'negative' else 0,
                'neutral': 1 if sentiment_result['label'] == 'neutral' else 0,
            },
            'hoax_probability': hoax_result['probability'],
            'hoax_label': hoax_result['label'],
            'articles': [{
                'article_id': job_id,
                'source_url': url,
                'title': article_data['title'],
                'content': article_data['content'][:500] + '...',
                'author': article_data.get('author'),
                'publication_date': article_data.get('publication_date'),
                'sentiment': sentiment_result,
                'hoax_classification': hoax_result,
            }],
            'source_breakdown': [{
                'source': 'Direct URL',
                'count': 1,
                'avg_sentiment': sentiment_result['score'],
            }],
            'top_keywords': nlp_pipeline.extract_keywords(cleaned_text, top_n=10),
            'explainability': explainability,
            'total_items': 1,
            'analyzed_at': str(datetime.now()),
        }
        
        save_analysis_results(job_id, results)
        update_job_status(job_id, 'completed', 100)
        
    except Exception as e:
        print(f"Error in analyze_url_task: {str(e)}")
        update_job_status(job_id, 'failed', 0)

@celery_app.task(name='celery_worker.analyze_topic_task')
def analyze_topic_task(job_id: str, keyword: str):
    """
    Celery task for analyzing a topic/keyword.
    """
    try:
        # Create job record
        create_analysis_job(job_id, 'topic', keyword)
        update_job_status(job_id, 'processing', 10)
        
        # Step 1: Crawl data from multiple sources
        crawled_data = crawl_topic(keyword, max_items=50)
        update_job_status(job_id, 'processing', 30)
        
        if not crawled_data:
            update_job_status(job_id, 'failed', 0)
            return
        
        # Step 2: Preprocess all texts
        processed_items = []
        for item in crawled_data:
            cleaned_text = preprocess_text(item['text'])
            processed_items.append({
                **item,
                'cleaned_text': cleaned_text
            })
        
        update_job_status(job_id, 'processing', 50)
        
        # Step 3: Batch analysis
        sentiment_results = []
        hoax_results = []
        
        for item in processed_items:
            sentiment = nlp_pipeline.analyze_sentiment(item['cleaned_text'])
            hoax = nlp_pipeline.classify_hoax(item['cleaned_text'])
            
            sentiment_results.append(sentiment)
            hoax_results.append(hoax)
        
        update_job_status(job_id, 'processing', 80)
        
        # Step 4: Aggregate results
        sentiment_counts = {
            'positive': sum(1 for s in sentiment_results if s['label'] == 'positive'),
            'negative': sum(1 for s in sentiment_results if s['label'] == 'negative'),
            'neutral': sum(1 for s in sentiment_results if s['label'] == 'neutral'),
        }
        
        avg_hoax_prob = sum(h['probability'] for h in hoax_results) / len(hoax_results)
        
        # Determine overall sentiment
        overall_sentiment = max(sentiment_counts, key=sentiment_counts.get)
        
        # Determine overall hoax classification
        if avg_hoax_prob > 0.7:
            overall_hoax = 'hoax'
        elif avg_hoax_prob < 0.3:
            overall_hoax = 'factual'
        else:
            overall_hoax = 'uncertain'
        
        # Generate explainability for overall classification
        all_texts = ' '.join([item['cleaned_text'] for item in processed_items])
        explainability = nlp_pipeline.explain_classification(
            all_texts[:5000],  # Limit text length
            {'label': overall_hoax, 'probability': avg_hoax_prob}
        )
        
        update_job_status(job_id, 'processing', 95)
        
        # Step 5: Save results
        results = {
            'job_id': job_id,
            'query_type': 'topic',
            'query_input': keyword,
            'status': 'completed',
            'overall_sentiment': overall_sentiment,
            'sentiment_breakdown': sentiment_counts,
            'hoax_probability': avg_hoax_prob,
            'hoax_label': overall_hoax,
            'articles': [
                {
                    'article_id': f"{job_id}_{idx}",
                    'source_url': item.get('url', ''),
                    'title': item.get('title', keyword),
                    'content': item['text'][:500] + '...',
                    'author': item.get('author'),
                    'publication_date': item.get('date'),
                    'sentiment': sentiment_results[idx],
                    'hoax_classification': hoax_results[idx],
                }
                for idx, item in enumerate(processed_items)
            ],
            'source_breakdown': aggregate_sources(processed_items, sentiment_results),
            'top_keywords': nlp_pipeline.extract_keywords(all_texts, top_n=15),
            'explainability': explainability,
            'total_items': len(processed_items),
            'analyzed_at': str(datetime.now()),
        }
        
        save_analysis_results(job_id, results)
        update_job_status(job_id, 'completed', 100)
        
    except Exception as e:
        print(f"Error in analyze_topic_task: {str(e)}")
        update_job_status(job_id, 'failed', 0)

def aggregate_sources(items, sentiments):
    """Helper function to aggregate source breakdown."""
    from collections import defaultdict
    
    source_counts = defaultdict(lambda: {'count': 0, 'sentiment_sum': 0})
    
    for item, sentiment in zip(items, sentiments):
        source = item.get('source', 'Unknown')
        source_counts[source]['count'] += 1
        source_counts[source]['sentiment_sum'] += sentiment['score']
    
    return [
        {
            'source': source,
            'count': data['count'],
            'avg_sentiment': data['sentiment_sum'] / data['count'],
        }
        for source, data in source_counts.items()
    ]

from datetime import datetime