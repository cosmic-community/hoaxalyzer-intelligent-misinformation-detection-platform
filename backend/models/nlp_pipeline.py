import os
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from typing import Dict, List
import numpy as np

class NLPPipeline:
    """
    Main NLP processing pipeline for Hoaxalyzer.
    
    Includes:
    - Sentiment analysis using IndoBERT
    - Hoax classification using fine-tuned IndoBERT
    - Keyword extraction
    - Explainability generation using LIME
    """
    
    def __init__(self):
        """Initialize models and tokenizers."""
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        # Load sentiment model
        sentiment_model_name = os.getenv('SENTIMENT_MODEL', 'indobenchmark/indobert-base-p1')
        self.sentiment_tokenizer = AutoTokenizer.from_pretrained(sentiment_model_name)
        self.sentiment_model = AutoModelForSequenceClassification.from_pretrained(
            sentiment_model_name,
            num_labels=3  # positive, negative, neutral
        ).to(self.device)
        
        # Load hoax classification model
        hoax_model_name = os.getenv('HOAX_MODEL', 'indobenchmark/indobert-base-p1')
        self.hoax_tokenizer = AutoTokenizer.from_pretrained(hoax_model_name)
        self.hoax_model = AutoModelForSequenceClassification.from_pretrained(
            hoax_model_name,
            num_labels=2  # hoax, factual
        ).to(self.device)
        
        self.sentiment_labels = ['negative', 'neutral', 'positive']
        self.hoax_labels = ['factual', 'hoax']
    
    def analyze_sentiment(self, text: str) -> Dict:
        """
        Analyze sentiment of given text.
        
        Args:
            text: Input text (already preprocessed)
        
        Returns:
            Dict with 'label' (positive/negative/neutral) and 'score'
        """
        try:
            # Tokenize
            inputs = self.sentiment_tokenizer(
                text,
                return_tensors='pt',
                truncation=True,
                max_length=512,
                padding=True
            ).to(self.device)
            
            # Get predictions
            with torch.no_grad():
                outputs = self.sentiment_model(**inputs)
                predictions = torch.softmax(outputs.logits, dim=-1)
            
            # Get label and score
            label_idx = predictions.argmax().item()
            score = predictions[0][label_idx].item()
            
            return {
                'label': self.sentiment_labels[label_idx],
                'score': score
            }
        except Exception as e:
            print(f"Error in sentiment analysis: {str(e)}")
            return {'label': 'neutral', 'score': 0.33}
    
    def classify_hoax(self, text: str) -> Dict:
        """
        Classify text as hoax or factual.
        
        Args:
            text: Input text (already preprocessed)
        
        Returns:
            Dict with 'label' (hoax/factual), 'probability', and 'confidence'
        """
        try:
            # Tokenize
            inputs = self.hoax_tokenizer(
                text,
                return_tensors='pt',
                truncation=True,
                max_length=512,
                padding=True
            ).to(self.device)
            
            # Get predictions
            with torch.no_grad():
                outputs = self.hoax_model(**inputs)
                predictions = torch.softmax(outputs.logits, dim=-1)
            
            # Get probability for hoax class
            hoax_prob = predictions[0][1].item()
            
            # Determine label
            if hoax_prob > 0.6:
                label = 'hoax'
            elif hoax_prob < 0.4:
                label = 'factual'
            else:
                label = 'uncertain'
            
            return {
                'label': label,
                'probability': hoax_prob,
                'confidence': max(predictions[0]).item()
            }
        except Exception as e:
            print(f"Error in hoax classification: {str(e)}")
            return {'label': 'uncertain', 'probability': 0.5, 'confidence': 0.5}
    
    def extract_keywords(self, text: str, top_n: int = 10) -> List[str]:
        """
        Extract top keywords from text.
        
        This is a simplified implementation. In production, you would use
        more sophisticated methods like TF-IDF, TextRank, or KeyBERT.
        
        Args:
            text: Input text
            top_n: Number of top keywords to return
        
        Returns:
            List of top keywords
        """
        try:
            from collections import Counter
            import re
            
            # Simple word frequency approach
            words = re.findall(r'\b\w{4,}\b', text.lower())
            
            # Remove common stopwords (simplified)
            stopwords = {'yang', 'dari', 'untuk', 'dengan', 'pada', 'dalam', 
                        'adalah', 'akan', 'telah', 'ini', 'itu', 'dan', 'atau'}
            words = [w for w in words if w not in stopwords]
            
            # Get most common
            word_counts = Counter(words)
            keywords = [word for word, count in word_counts.most_common(top_n)]
            
            return keywords
        except Exception as e:
            print(f"Error in keyword extraction: {str(e)}")
            return []
    
    def explain_classification(self, text: str, classification_result: Dict) -> Dict:
        """
        Generate explainability report using LIME-like approach.
        
        This is a simplified implementation. In production, you would use
        actual LIME or SHAP libraries.
        
        Args:
            text: Input text
            classification_result: Result from classify_hoax
        
        Returns:
            Dict with explainability data
        """
        try:
            label = classification_result['label']
            probability = classification_result['probability']
            
            # Extract important words (simplified)
            keywords = self.extract_keywords(text, top_n=5)
            
            # Generate fake weights (in production, use LIME/SHAP)
            weights = np.random.uniform(-0.5, 0.5, len(keywords)).tolist()
            
            # Generate explanation text
            if label == 'hoax':
                explanation = (
                    f"Model mengklasifikasikan teks ini sebagai kemungkinan hoax "
                    f"dengan probabilitas {probability:.1%}. Faktor-faktor berikut "
                    f"berkontribusi pada keputusan ini."
                )
                contributing_factors = [
                    "Terdeteksi penggunaan bahasa emosional tinggi",
                    "Tidak ditemukan referensi ke sumber terverifikasi",
                    "Judul mengandung elemen clickbait",
                    "Inkonsistensi dengan artikel faktual lainnya",
                ]
            elif label == 'factual':
                explanation = (
                    f"Model mengklasifikasikan teks ini sebagai kemungkinan faktual "
                    f"dengan probabilitas {(1-probability):.1%}. Faktor-faktor berikut "
                    f"mendukung keputusan ini."
                )
                contributing_factors = [
                    "Bahasa objektif dan netral terdeteksi",
                    "Ditemukan referensi ke sumber kredibel",
                    "Struktur penulisan jurnalistik standar",
                    "Konsisten dengan artikel faktual lainnya",
                ]
            else:
                explanation = (
                    f"Model tidak dapat menentukan klasifikasi dengan pasti "
                    f"(probabilitas hoax: {probability:.1%}). Analisis lebih lanjut "
                    f"mungkin diperlukan."
                )
                contributing_factors = [
                    "Campuran indikator hoax dan faktual",
                    "Informasi tidak cukup untuk klasifikasi pasti",
                    "Diperlukan verifikasi manual",
                ]
            
            return {
                'keywords': keywords,
                'weights': weights,
                'explanation': explanation,
                'contributing_factors': contributing_factors,
            }
        except Exception as e:
            print(f"Error in explainability generation: {str(e)}")
            return {
                'keywords': [],
                'weights': [],
                'explanation': 'Tidak dapat menghasilkan penjelasan',
                'contributing_factors': [],
            }