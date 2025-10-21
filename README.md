# 🔍 Hoaxalyzer - Intelligent Misinformation Detection Platform

![Hoaxalyzer Preview](https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=300&fit=crop&auto=format)

**Hoaxalyzer** adalah platform web canggih yang menganalisis artikel berita dan topik media sosial untuk mendeteksi sentimen publik dan mengklasifikasikan potensi misinformasi/hoax menggunakan state-of-the-art Natural Language Processing (NLP). Dibangun dengan fokus akademis untuk penelitian tesis dengan metodologi yang dapat dipertanggungjawabkan.

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
```bash
git clone <your-repo-url>
cd hoaxalyzer
```

2. **Install frontend dependencies**
```bash
bun install
```

3. **Set up Python virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

4. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
# Cosmic CMS (automatically configured)
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/hoaxalyzer
REDIS_URL=redis://localhost:6379

# Python Backend API
BACKEND_API_URL=http://localhost:8000

# Twitter/X API (optional - for social media scraping)
TWITTER_BEARER_TOKEN=your-twitter-bearer-token

# Model Configuration
SENTIMENT_MODEL=indobert-sentiment-classifier
HOAX_MODEL=indobert-hoax-detector
```

5. **Initialize database**
```bash
# Run migrations (from backend directory)
cd backend
python scripts/init_db.py
cd ..
```

6. **Download NLP models**
```bash
python backend/scripts/download_models.py
```

### Running the Application

**Terminal 1 - Frontend (Next.js)**
```bash
bun run dev
```

**Terminal 2 - Backend API (FastAPI)**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Terminal 3 - Celery Worker**
```bash
cd backend
celery -A celery_worker worker --loglevel=info
```

**Terminal 4 - Redis Server**
```bash
redis-server
```

**Terminal 5 - PostgreSQL**
```bash
# If not running as service
postgres -D /usr/local/var/postgres
```

Visit `http://localhost:3000` to see the application.

## 📚 Cosmic SDK Examples

### Storing Analysis Results

```typescript
// lib/cosmic-operations.ts
import { cosmic } from '@/lib/cosmic'

export async function saveAnalysisResult(data: {
  jobId: string
  queryType: 'url' | 'topic'
  queryInput: string
  results: any
}) {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'analysis-results',
      title: `Analysis: ${data.queryInput}`,
      slug: data.jobId,
      metadata: {
        job_id: data.jobId,
        query_type: data.queryType,
        query_input: data.queryInput,
        overall_sentiment: data.results.overallSentiment,
        hoax_probability: data.results.hoaxProbability,
        articles_analyzed: data.results.articlesCount,
        sentiment_breakdown: data.results.sentimentBreakdown,
        top_keywords: data.results.topKeywords,
        analyzed_at: new Date().toISOString()
      }
    })
    
    return response.object
  } catch (error) {
    console.error('Error saving analysis result:', error)
    throw new Error('Failed to save analysis result')
  }
}
```

### Fetching Historical Analysis

```typescript
// app/history/page.tsx
import { cosmic } from '@/lib/cosmic'

export default async function HistoryPage() {
  try {
    const { objects: analyses } = await cosmic.objects
      .find({ type: 'analysis-results' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(0)
    
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Analysis History</h1>
        <div className="grid gap-4">
          {analyses.map(analysis => (
            <AnalysisCard key={analysis.id} analysis={analysis} />
          ))}
        </div>
      </div>
    )
  } catch (error) {
    return <div>No analysis history found</div>
  }
}
```

### Managing Training Datasets

```typescript
// lib/dataset-operations.ts
export async function addTrainingExample(example: {
  text: string
  label: 'hoax' | 'factual'
  source: string
}) {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'training-data',
      title: `Training: ${example.text.substring(0, 50)}...`,
      metadata: {
        text_content: example.text,
        classification_label: example.label,
        source_url: example.source,
        verified: false,
        added_at: new Date().toISOString()
      }
    })
    
    return response.object
  } catch (error) {
    console.error('Error adding training example:', error)
    throw new Error('Failed to add training example')
  }
}
```

## 🎓 Cosmic CMS Integration

Hoaxalyzer uses Cosmic as a headless CMS to manage:

1. **Analysis Results Archive**
   - Stores completed analysis with full metadata
   - Enables historical trend analysis
   - Supports reproducibility for research

2. **Training Dataset Management**
   - Crowdsourced labeled data for model improvement
   - Version control for dataset iterations
   - Verification workflow for data quality

3. **Research Documentation**
   - Methodology documentation
   - Model performance metrics
   - Academic papers and citations

4. **User Submissions Tracking**
   - Analysis request history
   - User feedback on results
   - Feature requests and bug reports

All data is automatically synced with Cosmic CMS, providing a powerful backend for research and continuous improvement.

## 🌐 Deployment Options

### Vercel (Recommended for Frontend)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with automatic CI/CD

### Backend Deployment Options

**Option 1: Railway**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy backend
cd backend
railway login
railway init
railway up
```

**Option 2: Render**
- Create new Web Service
- Connect repository
- Add environment variables
- Deploy Python application

**Option 3: AWS EC2/DigitalOcean**
- Set up Ubuntu server
- Install dependencies
- Configure Nginx reverse proxy
- Set up systemd services for FastAPI & Celery

### Database Hosting

- **PostgreSQL**: Railway, Supabase, or AWS RDS
- **Redis**: Redis Labs, Railway, or AWS ElastiCache

### Environment Variables

Set these in your deployment platform:
```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
DATABASE_URL=your-production-database-url
REDIS_URL=your-production-redis-url
BACKEND_API_URL=your-backend-api-url
```

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Landing Page │  │ Input Form   │  │  Dashboard   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend API (FastAPI)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            REST API Endpoints                         │   │
│  │  POST /analyze/url    POST /analyze/topic            │   │
│  │  GET /results/{job_id}  GET /status/{job_id}        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│   Celery Task Queue     │   │    Redis (Broker)       │
│  ┌──────────────────┐   │   │  ┌──────────────────┐   │
│  │ Analysis Worker  │   │   │  │  Job Queue       │   │
│  │ Scraping Worker  │   │   │  │  Result Cache    │   │
│  └──────────────────┘   │   │  └──────────────────┘   │
└─────────────────────────┘   └─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│              NLP Processing Pipeline                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Scraping │→ │Preprocessing│→│Sentiment │→│  Hoax    │   │
│  │          │  │   (spaCy)  │  │(IndoBERT)│  │Classifier│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                      │                       │
│                                      ▼                       │
│                            ┌──────────────────┐             │
│                            │  Explainability  │             │
│                            │   (LIME/SHAP)    │             │
│                            └──────────────────┘             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│               PostgreSQL Database                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │AnalysisJobs  │  │  Articles    │  │   Results    │     │
│  │    Tweets    │  │ TrainingData │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Cosmic CMS                                │
│         (Content Management & Research Archive)              │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
hoaxalyzer/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   ├── analyze/
│   │   └── page.tsx            # Analysis input form
│   ├── results/
│   │   └── [jobId]/
│   │       └── page.tsx        # Dashboard results
│   ├── history/
│   │   └── page.tsx            # Historical analyses
│   └── api/
│       └── bucket-info/
│           └── route.ts        # API route for bucket info
├── components/                  # React components
│   ├── AnalysisForm.tsx
│   ├── DashboardCard.tsx
│   ├── SentimentChart.tsx
│   ├── HoaxScoreCard.tsx
│   ├── ExplainabilityBox.tsx
│   ├── WordCloud.tsx
│   ├── GeospatialMap.tsx
│   ├── ArticleList.tsx
│   └── CosmicBadge.tsx
├── lib/                         # Utilities
│   ├── cosmic.ts               # Cosmic SDK client
│   ├── api-client.ts           # Backend API client
│   └── types.ts                # TypeScript types
├── backend/                     # Python backend
│   ├── main.py                 # FastAPI app
│   ├── celery_worker.py        # Celery configuration
│   ├── models/
│   │   ├── nlp_pipeline.py    # NLP processing
│   │   ├── sentiment_model.py
│   │   └── hoax_classifier.py
│   ├── services/
│   │   ├── scraper.py         # Web scraping
│   │   ├── twitter_crawler.py
│   │   └── preprocessor.py
│   ├── database/
│   │   ├── models.py          # SQLAlchemy models
│   │   └── crud.py            # Database operations
│   └── scripts/
│       ├── init_db.py         # Database initialization
│       └── download_models.py # Download NLP models
├── public/
│   └── dashboard-console-capture.js
├── requirements.txt            # Python dependencies
├── package.json               # Node dependencies
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

---

Built with ❤️ for academic research and public good. Powered by **Cosmic CMS** for scalable content management.

<!-- README_END -->