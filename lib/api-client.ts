import axios from 'axios'
import type { AnalysisFormData, JobStatusResponse, ApiResponse } from './types'

const API_BASE_URL = process.env.BACKEND_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Submit URL analysis
export async function submitUrlAnalysis(
  url: string
): Promise<ApiResponse<{ job_id: string }>> {
  try {
    const response = await apiClient.post('/api/v1/analyze/url', { url })
    return {
      success: true,
      data: response.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.detail || 'Failed to submit URL analysis',
    }
  }
}

// Submit topic analysis
export async function submitTopicAnalysis(
  keyword: string
): Promise<ApiResponse<{ job_id: string }>> {
  try {
    const response = await apiClient.post('/api/v1/analyze/topic', { keyword })
    return {
      success: true,
      data: response.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.detail || 'Failed to submit topic analysis',
    }
  }
}

// Get job status and results
export async function getJobStatus(
  jobId: string
): Promise<ApiResponse<JobStatusResponse>> {
  try {
    const response = await apiClient.get(`/api/v1/results/${jobId}`)
    return {
      success: true,
      data: response.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.detail || 'Failed to fetch job status',
    }
  }
}

// Poll job status until completion
export async function pollJobStatus(
  jobId: string,
  onProgress?: (progress: number) => void,
  interval: number = 3000
): Promise<ApiResponse<JobStatusResponse>> {
  return new Promise((resolve) => {
    const poll = setInterval(async () => {
      const response = await getJobStatus(jobId)

      if (!response.success) {
        clearInterval(poll)
        resolve(response)
        return
      }

      if (response.data) {
        const { status, progress } = response.data

        if (progress && onProgress) {
          onProgress(progress)
        }

        if (status === 'completed' || status === 'failed') {
          clearInterval(poll)
          resolve(response)
        }
      }
    }, interval)
  })
}

// Health check
export async function healthCheck(): Promise<ApiResponse<{ status: string }>> {
  try {
    const response = await apiClient.get('/health')
    return {
      success: true,
      data: response.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: 'Backend service unavailable',
    }
  }
}