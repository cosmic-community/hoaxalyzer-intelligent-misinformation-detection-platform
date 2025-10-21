interface WordCloudProps {
  keywords: string[]
}

export default function WordCloud({ keywords }: WordCloudProps) {
  if (!keywords || keywords.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        Tidak ada kata kunci ditemukan
      </p>
    )
  }

  // Simple word cloud visualization using different font sizes
  const getFontSize = (index: number) => {
    const baseSize = 16
    const maxSize = 48
    const decrement = (maxSize - baseSize) / keywords.length
    return Math.max(baseSize, maxSize - index * decrement)
  }

  const getColor = (index: number) => {
    const colors = [
      'text-blue-600',
      'text-indigo-600',
      'text-purple-600',
      'text-pink-600',
      'text-red-600',
      'text-orange-600',
      'text-yellow-600',
      'text-green-600',
      'text-teal-600',
      'text-cyan-600',
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="flex flex-wrap gap-4 justify-center items-center min-h-[300px] p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg">
      {keywords.map((keyword, index) => (
        <span
          key={index}
          className={`font-bold ${getColor(index)} hover:scale-110 transition-transform cursor-default`}
          style={{ fontSize: `${getFontSize(index)}px` }}
        >
          {keyword}
        </span>
      ))}
    </div>
  )
}