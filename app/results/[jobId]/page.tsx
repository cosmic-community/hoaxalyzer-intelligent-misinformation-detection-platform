// app/results/[jobId]/page.tsx
import { Suspense } from 'react'
import ResultsDashboard from '@/components/ResultsDashboard'
import Link from 'next/link'

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
  const { jobId } = await params

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
              <Link
                href="/history"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Riwayat
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Memuat hasil analisis...</p>
              </div>
            </div>
          }
        >
          <ResultsDashboard jobId={jobId} />
        </Suspense>
      </main>
    </div>
  )
}