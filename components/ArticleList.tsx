import type { Article } from '@/lib/types'

interface ArticleListProps {
  articles: Article[]
}

export default function ArticleList({ articles }: ArticleListProps) {
  if (!articles || articles.length === 0) {
    return null
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">
        📰 Artikel yang Dianalisis ({articles.length})
      </h3>

      <div className="space-y-4">
        {articles.map((article) => (
          <div
            key={article.article_id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h4 className="font-semibold text-gray-900 flex-1">
                {article.title}
              </h4>
              <div className="flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    article.sentiment.label === 'positive'
                      ? 'bg-green-100 text-green-800'
                      : article.sentiment.label === 'negative'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {article.sentiment.label === 'positive'
                    ? 'Positif'
                    : article.sentiment.label === 'negative'
                    ? 'Negatif'
                    : 'Netral'}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    article.hoax_classification.label === 'hoax'
                      ? 'bg-red-100 text-red-800'
                      : article.hoax_classification.label === 'factual'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {article.hoax_classification.label === 'hoax'
                    ? 'Hoax'
                    : article.hoax_classification.label === 'factual'
                    ? 'Faktual'
                    : 'Uncertain'}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {article.content}
            </p>

            <div className="flex items-center justify-between text-sm">
              <div className="flex gap-4 text-gray-500">
                {article.author && (
                  <span>
                    👤 <strong>Penulis:</strong> {article.author}
                  </span>
                )}
                {article.publication_date && (
                  <span>
                    📅{' '}
                    {new Date(article.publication_date).toLocaleDateString(
                      'id-ID'
                    )}
                  </span>
                )}
              </div>
              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Lihat Artikel →
              </a>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Skor Sentimen:</span>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${article.sentiment.score * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <span className="text-gray-600">Probabilitas Hoax:</span>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{
                      width: `${article.hoax_classification.probability * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}