// Base Cosmic object interface
export interface CosmicObject {
  id: string
  slug: string
  title: string
  content?: string
  metadata: Record<string, any>
  type: string
  created_at: string
  modified_at: string
}

// Analysis Job Types
export type AnalysisQueryType = 'url' | 'topic'
export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface AnalysisJob {
  job_id: string
  query_type: AnalysisQueryType
  query_input: string
  status: AnalysisStatus
  progress?: number
  created_at: string
  completed_at?: string
}

// Sentiment Analysis Types
export type SentimentLabel = 'positive' | 'negative' | 'neutral'

export interface SentimentScore {
  label: SentimentLabel
  score: number
}

export interface SentimentBreakdown {
  positive: number
  negative: number
  neutral: number
}

// Hoax Classification Types
export type HoaxLabel = 'hoax' | 'factual' | 'uncertain'

export interface HoaxClassification {
  label: HoaxLabel
  probability: number
  confidence: number
}

// Article/Content Types
export interface Article {
  article_id: string
  source_url: string
  title: string
  content: string
  author?: string
  publication_date?: string
  sentiment: SentimentScore
  hoax_classification: HoaxClassification
}

export interface Tweet {
  tweet_id: string
  author: string
  text: string
  created_at: string
  location?: string
  sentiment: SentimentScore
}

// Analysis Results Types
export interface ExplainabilityData {
  keywords: string[]
  weights: number[]
  explanation: string
  contributing_factors: string[]
}

export interface TimeSeriesData {
  timestamp: string
  positive: number
  negative: number
  neutral: number
}

export interface SourceBreakdown {
  source: string
  count: number
  avg_sentiment: number
}

export interface GeolocationData {
  lat: number
  lng: number
  count: number
  sentiment: SentimentLabel
}

export interface AnalysisResults {
  job_id: string
  query_type: AnalysisQueryType
  query_input: string
  status: AnalysisStatus
  
  // Overall Metrics
  overall_sentiment: SentimentLabel
  sentiment_breakdown: SentimentBreakdown
  hoax_probability: number
  hoax_label: HoaxLabel
  
  // Detailed Data
  articles: Article[]
  tweets?: Tweet[]
  
  // Visualizations Data
  time_series?: TimeSeriesData[]
  source_breakdown: SourceBreakdown[]
  top_keywords: string[]
  geolocation_data?: GeolocationData[]
  
  // Explainability
  explainability: ExplainabilityData
  
  // Metadata
  total_items: number
  analyzed_at: string
  processing_time_seconds?: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface JobStatusResponse {
  job_id: string
  status: AnalysisStatus
  progress?: number
  message?: string
  results?: AnalysisResults
}

// Form Types
export interface AnalysisFormData {
  query_type: AnalysisQueryType
  query_input: string
}

// Cosmic CMS Types
export interface AnalysisResultCosmic extends CosmicObject {
  type: 'analysis-results'
  metadata: {
    job_id: string
    query_type: AnalysisQueryType
    query_input: string
    overall_sentiment: SentimentLabel
    hoax_probability: number
    hoax_label: HoaxLabel
    articles_analyzed: number
    sentiment_breakdown: SentimentBreakdown
    top_keywords: string[]
    analyzed_at: string
  }
}

export interface TrainingDataCosmic extends CosmicObject {
  type: 'training-data'
  metadata: {
    text_content: string
    classification_label: HoaxLabel
    source_url?: string
    verified: boolean
    added_at: string
    verified_by?: string
  }
}

// Chart Data Types
export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string
  borderWidth?: number
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}