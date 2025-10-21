from bs4 import BeautifulSoup
import requests
from typing import Dict, Optional
from datetime import datetime

def scrape_article(url: str) -> Optional[Dict]:
    """
    Scrape article content from a given URL.
    
    Args:
        url: Article URL to scrape
    
    Returns:
        Dict with article data (title, content, author, date) or None if failed
    """
    try:
        # Set headers to mimic browser
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        # Fetch the page
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Parse HTML
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract title
        title = None
        title_tag = soup.find('h1') or soup.find('title')
        if title_tag:
            title = title_tag.get_text().strip()
        
        # Extract main content
        # Try common content containers
        content = None
        content_selectors = [
            {'name': 'article'},
            {'class': 'article-content'},
            {'class': 'post-content'},
            {'class': 'entry-content'},
            {'id': 'content'},
        ]
        
        for selector in content_selectors:
            content_tag = soup.find(**selector)
            if content_tag:
                # Get all paragraph text
                paragraphs = content_tag.find_all('p')
                content = ' '.join([p.get_text().strip() for p in paragraphs])
                break
        
        # Fallback: get all paragraphs
        if not content:
            paragraphs = soup.find_all('p')
            content = ' '.join([p.get_text().strip() for p in paragraphs])
        
        # Extract author
        author = None
        author_selectors = [
            {'class': 'author'},
            {'class': 'by-author'},
            {'rel': 'author'},
        ]
        
        for selector in author_selectors:
            author_tag = soup.find(**selector)
            if author_tag:
                author = author_tag.get_text().strip()
                break
        
        # Extract publication date
        date = None
        date_selectors = [
            {'class': 'date'},
            {'class': 'published'},
            {'property': 'article:published_time'},
        ]
        
        for selector in date_selectors:
            date_tag = soup.find(**selector)
            if date_tag:
                date = date_tag.get('content') or date_tag.get_text().strip()
                break
        
        if not title or not content:
            return None
        
        return {
            'title': title,
            'content': content,
            'author': author,
            'publication_date': date,
            'url': url,
        }
        
    except Exception as e:
        print(f"Error scraping URL {url}: {str(e)}")
        return None