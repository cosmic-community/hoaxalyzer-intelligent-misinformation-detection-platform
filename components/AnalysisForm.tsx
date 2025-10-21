'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitUrlAnalysis, submitTopicAnalysis } from '@/lib/api-client'
import type { AnalysisQueryType } from '@/lib/types'

export default function AnalysisForm() {
  const router = useRouter()
  const [queryType, setQueryType] = useState<AnalysisQueryType>('url')
  const [input, setInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Validate input
      if (!input.trim()) {
        setError('Harap masukkan URL atau topik')
        setIsSubmitting(false)
        return
      }

      // Submit analysis based on type
      const response =
        queryType === 'url'
          ? await submitUrlAnalysis(input)
          : await submitTopicAnalysis(input)

      if (!response.success) {
        setError(response.error || 'Gagal memulai analisis')
        setIsSubmitting(false)
        return
      }

      // Redirect to results page with job ID
      if (response.data?.job_id) {
        router.push(`/results/${response.data.job_id}`)
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        {/* Query Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Metode Analisis
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setQueryType('url')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                queryType === 'url'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📰 Single URL
            </button>
            <button
              type="button"
              onClick={() => setQueryType('topic')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                queryType === 'topic'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔍 Topik/Keyword
            </button>
          </div>
        </div>

        {/* Input Field */}
        <div className="mb-6">
          <label
            htmlFor="input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {queryType === 'url'
              ? 'URL Artikel Berita'
              : 'Kata Kunci Topik'}
          </label>
          <input
            type="text"
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              queryType === 'url'
                ? 'https://example.com/news/artikel'
                : 'Contoh: Pemilu 2024'
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
          />
          <p className="mt-2 text-sm text-gray-500">
            {queryType === 'url'
              ? 'Masukkan URL lengkap artikel berita yang ingin dianalisis'
              : 'Masukkan topik atau kata kunci untuk pencarian di media sosial dan portal berita'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !input.trim()}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Memproses...
            </>
          ) : (
            <>🚀 Mulai Analisis</>
          )}
        </button>
      </form>

      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          ℹ️ Informasi Penting:
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Analisis URL memerlukan koneksi ke artikel yang valid</li>
          <li>
            • Analisis topik akan mengumpulkan data dari berbagai sumber
          </li>
          <li>• Hasil analisis akan disimpan dalam riwayat Anda</li>
          <li>
            • Proses dapat memakan waktu beberapa menit tergantung
            kompleksitas
          </li>
        </ul>
      </div>
    </div>
  )
}