import os
from typing import List, Dict
import requests
from datetime import datetime, timedelta

def crawl_topic(keyword: str, max_items: int = 50) -> List[Dict]:
    """
    Crawl social media and news sources for a given topic/keyword.
    
    Note: This is a simplified implementation. In production, you would:
    1. Use Twitter API v2 with proper authentication
    2. Implement rate limiting and pagination
    3. Add support for multiple social media platforms
    4. Scrape news portals programmatically
    
    Args:
        keyword: Search keyword/topic
        max_items: Maximum number of items to collect
    
    Returns:
        List of dicts with text data and metadata
    """
    results = []
    
    # Twitter API implementation would go here
    # For demo purposes, returning mock data
    
    # Mock Twitter-like data
    twitter_data = generate_mock_twitter_data(keyword, max_items // 2)
    results.extend(twitter_data)
    
    # Mock news article data
    news_data = generate_mock_news_data(keyword, max_items // 2)
    results.extend(news_data)
    
    return results[:max_items]

def generate_mock_twitter_data(keyword: str, count: int) -> List[Dict]:
    """Generate mock Twitter data for demonstration."""
    import random
    
    sentiments = ['positive', 'negative', 'neutral']
    mock_tweets = []
    
    for i in range(count):
        mock_tweets.append({
            'source': 'Twitter',
            'type': 'tweet',
            'text': f"Mock tweet about {keyword}. This is sample text for demonstration purposes. {random.choice(['Great news!', 'Concerning development.', 'Interesting update.'])}",
            'author': f'@user{i+1}',
            'url': f'https://twitter.com/user{i+1}/status/{random.randint(1000000, 9999999)}',
            'date': (datetime.now() - timedelta(days=random.randint(0, 30))).isoformat(),
            'location': random.choice(['Jakarta', 'Surabaya', 'Bandung', None]),
        })
    
    return mock_tweets

def generate_mock_news_data(keyword: str, count: int) -> List[Dict]:
    """Generate mock news article data for demonstration."""
    import random
    
    news_sources = ['Kompas.com', 'Detik.com', 'Tempo.co', 'CNN Indonesia']
    mock_articles = []
    
    for i in range(count):
        source = random.choice(news_sources)
        mock_articles.append({
            'source': source,
            'type': 'article',
            'text': f"Mock news article about {keyword}. This is comprehensive coverage of the topic with multiple paragraphs. {' '.join(['Lorem ipsum dolor sit amet.' for _ in range(5)])}",
            'title': f"Breaking: Development in {keyword} Case",
            'author': f"Reporter {i+1}",
            'url': f'https://{source.lower().replace(" ", "")}/news/article-{random.randint(1000, 9999)}',
            'date': (datetime.now() - timedelta(days=random.randint(0, 7))).isoformat(),
        })
    
    return mock_articles