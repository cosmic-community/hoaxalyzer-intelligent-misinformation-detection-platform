import AnalysisForm from '@/components/AnalysisForm'
import Link from 'next/link'

export default function AnalyzePage() {
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
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Mulai Analisis Baru
            </h1>
            <p className="text-xl text-gray-600">
              Pilih metode analisis yang Anda inginkan
            </p>
          </div>

          <AnalysisForm />

          {/* Information Cards */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="card bg-blue-50">
              <h3 className="text-lg font-semibold mb-3 text-blue-900">
                📰 Analisis URL
              </h3>
              <p className="text-sm text-gray-700">
                Masukkan URL artikel berita untuk menganalisis konten,
                mendeteksi potensi hoax, dan mengukur sentimen. Sistem akan
                melakukan scraping otomatis dan analisis mendalam.
              </p>
              <div className="mt-4 text-sm text-gray-600">
                <strong>Contoh:</strong>
                <br />
                https://example.com/news/artikel-berita
              </div>
            </div>

            <div className="card bg-green-50">
              <h3 className="text-lg font-semibold mb-3 text-green-900">
                🔍 Analisis Topik
              </h3>
              <p className="text-sm text-gray-700">
                Masukkan kata kunci topik untuk mengumpulkan dan menganalisis
                data dari berbagai sumber (media sosial, portal berita).
                Mendapatkan gambaran sentimen publik secara menyeluruh.
              </p>
              <div className="mt-4 text-sm text-gray-600">
                <strong>Contoh:</strong>
                <br />
                Pemilu 2024, Subsidi BBM, Kenaikan Harga
              </div>
            </div>
          </div>

          {/* Processing Information */}
          <div className="mt-8 card bg-yellow-50">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚡</div>
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">
                  Estimasi Waktu Pemrosesan
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Analisis URL: 30 detik - 2 menit</li>
                  <li>• Analisis Topik: 2 - 5 menit</li>
                  <li>
                    • Waktu dapat bervariasi tergantung kompleksitas data
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}