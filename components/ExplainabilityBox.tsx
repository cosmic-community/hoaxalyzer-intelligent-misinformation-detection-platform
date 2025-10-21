import type { ExplainabilityData } from '@/lib/types'

interface ExplainabilityBoxProps {
  explainability: ExplainabilityData
}

export default function ExplainabilityBox({
  explainability,
}: ExplainabilityBoxProps) {
  if (!explainability) {
    return null
  }

  return (
    <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
      <div className="flex items-start gap-3 mb-4">
        <div className="text-3xl">💡</div>
        <div>
          <h3 className="text-lg font-semibold text-purple-900">
            Explainable AI - Penjelasan Klasifikasi
          </h3>
          <p className="text-sm text-purple-700 mt-1">
            Model AI memberikan transparansi penuh tentang keputusan
            klasifikasi
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 mb-4">
        <h4 className="font-semibold mb-2">📝 Penjelasan:</h4>
        <p className="text-gray-700 leading-relaxed">
          {explainability.explanation}
        </p>
      </div>

      <div className="bg-white rounded-lg p-4 mb-4">
        <h4 className="font-semibold mb-3">🔍 Faktor Penentu Klasifikasi:</h4>
        <ul className="space-y-2">
          {explainability.contributing_factors.map((factor, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-700">
              <span className="text-purple-600 font-bold">•</span>
              <span>{factor}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-lg p-4">
        <h4 className="font-semibold mb-3">
          🏷️ Kata Kunci yang Mempengaruhi (LIME/SHAP):
        </h4>
        <div className="flex flex-wrap gap-2">
          {explainability.keywords.map((keyword, index) => {
            const weight = explainability.weights[index] || 0
            const isNegative = weight < 0
            
            return (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isNegative
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {keyword}
                <span className="ml-1 text-xs">
                  ({(Math.abs(weight) * 100).toFixed(0)}%)
                </span>
              </span>
            )
          })}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Kata dengan latar merah berkontribusi pada klasifikasi "hoax",
          sedangkan hijau berkontribusi pada "factual"
        </p>
      </div>
    </div>
  )
}