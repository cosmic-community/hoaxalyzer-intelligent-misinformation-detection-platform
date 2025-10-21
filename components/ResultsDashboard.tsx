'use client'

import { useState, useEffect } from 'react'
import { pollJobStatus } from '@/lib/api-client'
import type { AnalysisResults, AnalysisStatus } from '@/lib/types'
import HoaxScoreCard from './HoaxScoreCard'
import SentimentChart from './SentimentChart'
import ExplainabilityBox from './ExplainabilityBox'
import ArticleList from './ArticleList'
import SourceBreakdownChart from './SourceBreakdownChart'
import TimeSeriesChart from './TimeSeriesChart'
import WordCloud from './WordCloud'

interface ResultsDashboardProps {
  jobId: string
}

export default function ResultsDashboard({ jobId }: ResultsDashboardProps) {
  const [status, setStatus] = useState<AnalysisStatus>('pending')
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<AnalysisResults | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await pollJobStatus(jobId, (prog) =>
          setProgress(prog)
        )

        if (!response.success) {
          setError(response.error || 'Gagal memuat hasil')
          setStatus('failed')
          return
        }

        if (response.data) {
          setStatus(response.data.status)

          if (response.data.status === 'completed' && response.data.results) {
            setResults(response.data.results)
          } else if (response.data.status === 'failed') {
            setError('Analisis gagal diproses')
          }
        }
      } catch (err) {
        setError('Terjadi kesalahan saat memuat hasil')
        setStatus('failed')
      }
    }

    fetchResults()
  }, [jobId])

  // Loading state
  if (status === 'pending' || status === 'processing') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">
            {status === 'pending' ? 'Memulai Analisis...' : 'Memproses Data...'}
          </h2>
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">{progress}% selesai</p>
          </div>
          <div className="text-left bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">📋 Tahapan Proses:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✅ Mengumpulkan data dari sumber</li>
              <li>⚙️ Preprocessing teks bahasa Indonesia</li>
              <li>🤖 Analisis sentimen dengan IndoBERT</li>
              <li>🔍 Klasifikasi hoax detection</li>
              <li>💡 Menghasilkan explainability report</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (status === 'failed' || error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card bg-red-50 border border-red-200">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-900 mb-2">
              Analisis Gagal
            </h2>
            <p className="text-red-700 mb-6">
              {error || 'Terjadi kesalahan saat memproses analisis'}
            </p>
            <a
              href="/analyze"
              className="inline-block btn-primary"
            >
              Coba Lagi
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Results state
  if (!results) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <p className="text-gray-600">Tidak ada hasil untuk ditampilkan</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Hasil Analisis</h1>
            <p className="text-gray-600">
              {results.query_type === 'url' ? '📰 URL' : '🔍 Topik'}:{' '}
              <span className="font-medium">{results.query_input}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Dianalisis pada:{' '}
              {new Date(results.analyzed_at).toLocaleString('id-ID')}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Total Item</div>
            <div className="text-3xl font-bold text-blue-600">
              {results.total_items}
            </div>
          </div>
        </div>
      </div>

      {/* Main Metrics Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <HoaxScoreCard
          probability={results.hoax_probability}
          label={results.hoax_label}
        />
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Sentimen Dominan</h3>
          <div className="text-center">
            <div className="text-5xl mb-2">
              {results.overall_sentiment === 'positive' ? '😊' : 
               results.overall_sentiment === 'negative' ? '😞' : '😐'}
            </div>
            <div className="text-2xl font-bold capitalize">
              {results.overall_sentiment === 'positive' ? 'Positif' :
               results.overall_sentiment === 'negative' ? 'Negatif' : 'Netral'}
            </div>
          </div>
        </div>
      </div>

      {/* Sentiment Analysis */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">
          📊 Distribusi Sentimen
        </h3>
        <SentimentChart sentimentBreakdown={results.sentiment_breakdown} />
      </div>

      {/* Explainability */}
      <ExplainabilityBox explainability={results.explainability} />

      {/* Time Series (if available) */}
      {results.time_series && results.time_series.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">
            📈 Tren Sentimen Seiring Waktu
          </h3>
          <TimeSeriesChart data={results.time_series} />
        </div>
      )}

      {/* Source Breakdown */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">
          🌐 Distribusi Sumber
        </h3>
        <SourceBreakdownChart sources={results.source_breakdown} />
      </div>

      {/* Word Cloud */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">
          ☁️ Kata Kunci Utama
        </h3>
        <WordCloud keywords={results.top_keywords} />
      </div>

      {/* Article List */}
      <ArticleList articles={results.articles} />
    </div>
  )
}