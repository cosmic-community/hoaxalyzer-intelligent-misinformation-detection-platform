import { createBucketClient } from '@cosmicjs/sdk'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Type guard for error handling
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error
}

// Save analysis result to Cosmic
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
        hoax_label: data.results.hoaxLabel,
        articles_analyzed: data.results.totalItems,
        sentiment_breakdown: data.results.sentimentBreakdown,
        top_keywords: data.results.topKeywords,
        analyzed_at: new Date().toISOString(),
      },
    })

    return response.object
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      throw new Error('Cosmic bucket not found')
    }
    throw new Error('Failed to save analysis result')
  }
}

// Get analysis history
export async function getAnalysisHistory() {
  try {
    const response = await cosmic.objects
      .find({ type: 'analysis-results' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(0)

    return response.objects
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch analysis history')
  }
}

// Get single analysis result
export async function getAnalysisById(jobId: string) {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'analysis-results', slug: jobId })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(0)

    return response.object
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch analysis')
  }
}

// Add training example
export async function addTrainingExample(example: {
  text: string
  label: 'hoax' | 'factual'
  source?: string
}) {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'training-data',
      title: `Training: ${example.text.substring(0, 50)}...`,
      metadata: {
        text_content: example.text,
        classification_label: example.label,
        source_url: example.source || '',
        verified: false,
        added_at: new Date().toISOString(),
      },
    })

    return response.object
  } catch (error) {
    throw new Error('Failed to add training example')
  }
}

// Get training dataset
export async function getTrainingDataset() {
  try {
    const response = await cosmic.objects
      .find({ type: 'training-data' })
      .props(['id', 'title', 'metadata'])
      .depth(0)

    return response.objects
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch training dataset')
  }
}