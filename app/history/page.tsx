import { getAnalysisHistory } from '@/lib/cosmic'
import Link from 'next/link'

export default async function HistoryPage() {
  const analyses = await getAnalysisHistory()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              🔍 Hoaxalyzer
            </Link>
            <nav className="flex gap-6">
              <Link
                href="/"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/analyze"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Analisis Baru
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Riwayat Analisis</h1>

          {analyses.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h2 className="text-2xl font-semibold mb-2">
                Belum Ada Riwayat
              </h2>
              <p className="text-gray-600 mb-6">
                Anda belum melakukan analisis apapun
              </p>
              <Link href="/analyze" className="btn-primary inline-block">
                Mulai Analisis Pertama
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {analyses.map((analysis) => (
                <Link
                  key={analysis.id}
                  href={`/results/${analysis.metadata.job_id}`}
                  className="card hover:shadow-lg transition-shadow block"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">
                          {analysis.metadata.query_type === 'url'
                            ? '📰'
                            : '🔍'}
                        </span>
                        <h3 className="text-lg font-semibold">
                          {analysis.metadata.query_input}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <span>
                          📅{' '}
                          {new Date(
                            analysis.metadata.analyzed_at
                          ).toLocaleDateString('id-ID')}
                        </span>
                        <span>
                          📊 {analysis.metadata.articles_analyzed} artikel
                        </span>
                        <span className="capitalize">
                          💭 {analysis.metadata.overall_sentiment === 'positive' ? 'Positif' : analysis.metadata.overall_sentiment === 'negative' ? 'Negatif' : 'Netral'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-3xl font-bold ${
                          analysis.metadata.hoax_label === 'hoax'
                            ? 'text-red-600'
                            : analysis.metadata.hoax_label === 'factual'
                            ? 'text-green-600'
                            : 'text-yellow-600'
                        }`}
                      >
                        {Math.round(
                          analysis.metadata.hoax_probability * 100
                        )}
                        %
                      </div>
                      <div className="text-xs text-gray-500">
                        {analysis.metadata.hoax_label === 'hoax'
                          ? 'Hoax'
                          : analysis.metadata.hoax_label === 'factual'
                          ? 'Faktual'
                          : 'Uncertain'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {analysis.metadata.top_keywords
                      ?.slice(0, 5)
                      .map((keyword: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}