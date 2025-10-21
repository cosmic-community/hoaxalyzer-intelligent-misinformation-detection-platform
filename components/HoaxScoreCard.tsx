import type { HoaxLabel } from '@/lib/types'

interface HoaxScoreCardProps {
  probability: number
  label: HoaxLabel
}

export default function HoaxScoreCard({
  probability,
  label,
}: HoaxScoreCardProps) {
  const percentage = Math.round(probability * 100)

  const getColorClass = () => {
    if (label === 'hoax') return 'text-red-600'
    if (label === 'factual') return 'text-green-600'
    return 'text-yellow-600'
  }

  const getBgClass = () => {
    if (label === 'hoax') return 'bg-red-50 border-red-200'
    if (label === 'factual') return 'bg-green-50 border-green-200'
    return 'bg-yellow-50 border-yellow-200'
  }

  const getEmoji = () => {
    if (label === 'hoax') return '⚠️'
    if (label === 'factual') return '✅'
    return '❓'
  }

  const getLabel = () => {
    if (label === 'hoax') return 'Likely Misinformation'
    if (label === 'factual') return 'Likely Factual'
    return 'Uncertain'
  }

  return (
    <div className={`card border-2 ${getBgClass()}`}>
      <h3 className="text-lg font-semibold mb-4">Skor Klasifikasi Hoax</h3>
      <div className="text-center">
        <div className="text-6xl mb-4">{getEmoji()}</div>
        <div className={`text-5xl font-bold mb-2 ${getColorClass()}`}>
          {percentage}%
        </div>
        <div className="text-xl font-semibold text-gray-700 mb-4">
          {getLabel()}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className={`h-4 rounded-full transition-all ${
              label === 'hoax'
                ? 'bg-red-600'
                : label === 'factual'
                ? 'bg-green-600'
                : 'bg-yellow-600'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Confidence Indicator */}
        <div className="text-sm text-gray-600">
          <strong>Tingkat Keyakinan:</strong>{' '}
          {percentage > 80
            ? 'Sangat Tinggi'
            : percentage > 60
            ? 'Tinggi'
            : percentage > 40
            ? 'Sedang'
            : 'Rendah'}
        </div>
      </div>
    </div>
  )
}