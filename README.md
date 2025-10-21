# 🔍 Hoaxalyzer - Intelligent Misinformation Detection Platform

![Hoaxalyzer Preview](https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=300&fit=crop&auto=format)

**Hoaxalyzer** adalah platform web canggih yang menganalisis artikel berita dan topik media sosial untuk mendeteksi sentimen publik dan mengklasifikasikan potensi misinformasi/hoax menggunakan state-of-the-art Natural Language Processing (NLP). Dibangun dengan fokus akademis untuk penelitian tesis dengan metodologi yang dapat dipertanggungjawabkan.

## 👤 Author

**Created by: Parrosz**

This project is the intellectual property of Parrosz. All rights reserved.

## ✨ Features

- **🎯 Dual Analysis Mode**: Analisis single URL artikel atau monitoring topik trending
- **🤖 Advanced NLP Pipeline**: IndoBERT-based sentiment & hoax classification
- **💡 Explainable AI**: LIME/SHAP integration untuk transparansi model
- **📊 Interactive Dashboards**: Real-time visualizations dengan Chart.js
- **🗺️ Geospatial Mapping**: Visualisasi sebaran geografis informasi
- **⚡ Asynchronous Processing**: Celery task queue untuk analisis berat
- **🔐 Secure Architecture**: PostgreSQL + Redis untuk data persistence
- **📱 Responsive Design**: Mobile-first UI dengan Tailwind CSS
- **🌐 Multi-Source Scraping**: Automated data collection dari news portals & social media
- **📈 Sentiment Tracking**: Time-series analysis untuk monitoring tren sentimen

## Clone this Project

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=68f5aa664c6c2e246ad69492&clone_repository=68f737b4278bb75aded05543)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> No content model prompt provided - app built from existing content structure

### Code Generation Prompt

> Design a complete system architecture for 'Hoaxalyzer' - a web portal that analyzes news articles and social media topics to detect public sentiment and classify potential misinformation/hoax. The project should have strong academic weight, suitable for thesis research, with focus on NLP methodology and interactive data visualization. Core tech stack: React TypeScript frontend with D3.js/Chart.js, Tailwind CSS, Python FastAPI backend, PostgreSQL database, Redis caching, Celery for async processing, Hugging Face Transformers with IndoBERT, spaCy, scikit-learn, and web scraping with BeautifulSoup/Scrapy. Features include landing page with methodology explanation, analysis input form (single URL or keyword topic), interactive dashboard with sentiment analysis visuals, hoax probability scores, explainability components, word clouds, geospatial maps, and article/tweet lists. Backend should have async task queue, scraping services, NLP pipeline with preprocessing for Indonesian language, sentiment analysis, hoax classification, and LIME/SHAP explainability. Database schema should support analysis jobs, collected articles, analysis results, and tweets.

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠️ Technologies Used

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Chart.js** - Interactive data visualizations
- **React Query** - Data fetching & caching

### Backend
- **Python FastAPI** - High-performance async API
- **Celery** - Distributed task queue
- **Redis** - Caching & message broker
- **PostgreSQL** - Primary database

### NLP & ML
- **Hugging Face Transformers** - IndoBERT models
- **spaCy** - Text preprocessing
- **Scikit-learn** - ML utilities
- **LIME/SHAP** - Model explainability

### Data Collection
- **BeautifulSoup4** - HTML parsing
- **Scrapy** - Web scraping framework
- **Playwright** - Browser automation

### CMS
- **Cosmic** - Headless CMS for content management

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and **Bun** installed
- **Python 3.10+** with pip
- **PostgreSQL 14+** database
- **Redis 7+** server
- Cosmic account with bucket created

### Installation

1. **Clone the repository**