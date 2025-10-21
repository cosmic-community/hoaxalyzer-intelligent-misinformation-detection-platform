import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              🔍 Hoaxalyzer
            </h1>
            <p className="text-2xl mb-4 text-blue-100">
              Intelligent Misinformation Detection Platform
            </p>
            <p className="text-xl mb-8 text-blue-200">
              Menganalisis artikel berita dan topik media sosial menggunakan
              teknologi Natural Language Processing untuk mendeteksi sentimen
              publik dan mengklasifikasikan potensi hoax
            </p>
            <Link
              href="/analyze"
              className="inline-block bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              Mulai Analisis →
            </Link>
          </div>
        </div>
      </section>

      {/* What is Hoaxalyzer */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Apa itu Hoaxalyzer?
            </h2>
            <div className="prose prose-lg mx-auto">
              <p className="text-gray-700 leading-relaxed mb-4">
                Hoaxalyzer adalah platform analisis misinformasi berbasis NLP
                yang dirancang untuk membantu publik dan peneliti memahami
                penyebaran informasi di media digital. Dengan menggunakan
                model machine learning state-of-the-art seperti IndoBERT,
                platform ini dapat:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>
                  ✅ Mengklasifikasikan artikel berita sebagai hoax atau
                  faktual dengan tingkat akurasi tinggi
                </li>
                <li>
                  📊 Menganalisis sentimen publik (positif, negatif, netral)
                  terhadap topik tertentu
                </li>
                <li>
                  🔬 Memberikan penjelasan transparan tentang keputusan model
                  (Explainable AI)
                </li>
                <li>
                  📈 Memvisualisasikan tren sentimen dan pola penyebaran
                  informasi
                </li>
                <li>
                  🗺️ Memetakan distribusi geografis dari diskusi topik
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Metodologi Penelitian
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-xl font-semibold mb-3">
                  NLP Pipeline
                </h3>
                <p className="text-gray-600">
                  Preprocessing dengan spaCy, tokenisasi bahasa Indonesia,
                  dan feature extraction menggunakan Hugging Face Transformers
                </p>
              </div>
              
              <div className="card">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-3">
                  Model Training
                </h3>
                <p className="text-gray-600">
                  Fine-tuning IndoBERT pada dataset labeled Indonesian news
                  untuk sentiment dan hoax classification
                </p>
              </div>
              
              <div className="card">
                <div className="text-4xl mb-4">💡</div>
                <h3 className="text-xl font-semibold mb-3">
                  Explainable AI
                </h3>
                <p className="text-gray-600">
                  Implementasi LIME dan SHAP untuk interpretabilitas model
                  dan transparansi keputusan klasifikasi
                </p>
              </div>
              
              <div className="card">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-3">
                  Data Visualization
                </h3>
                <p className="text-gray-600">
                  Dashboard interaktif dengan Chart.js untuk analisis visual
                  tren sentimen dan pola penyebaran informasi
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Results Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Contoh Hasil Analisis
            </h2>
            <div className="card bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    78%
                  </div>
                  <div className="text-sm text-gray-600">
                    Probabilitas Hoax
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">
                    Negatif
                  </div>
                  <div className="text-sm text-gray-600">
                    Sentimen Dominan
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    156
                  </div>
                  <div className="text-sm text-gray-600">
                    Artikel Dianalisis
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold mb-2">
                  🔍 Faktor Penentu Klasifikasi:
                </h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Bahasa emosional tinggi terdeteksi</li>
                  <li>• Tidak ditemukan sumber terverifikasi</li>
                  <li>• Judul bersifat clickbait</li>
                  <li>• Inkonsistensi dengan artikel faktual lainnya</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-bg text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Siap Menganalisis Informasi?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Mulai deteksi hoax dan analisis sentimen sekarang
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/analyze"
              className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Analisis Sekarang
            </Link>
            <Link
              href="/history"
              className="bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors border border-blue-600"
            >
              Lihat Riwayat
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Hoaxalyzer. Dibangun untuk penelitian
            akademis dan kepentingan publik.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Powered by Cosmic CMS, Next.js, FastAPI, dan IndoBERT
          </p>
        </div>
      </footer>
    </div>
  )
}