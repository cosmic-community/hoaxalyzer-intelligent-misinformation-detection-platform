'use client'

import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'
import type { SentimentBreakdown } from '@/lib/types'

ChartJS.register(ArcElement, Tooltip, Legend)

interface SentimentChartProps {
  sentimentBreakdown: SentimentBreakdown
}

export default function SentimentChart({
  sentimentBreakdown,
}: SentimentChartProps) {
  const data = {
    labels: ['Positif', 'Negatif', 'Netral'],
    datasets: [
      {
        data: [
          sentimentBreakdown.positive,
          sentimentBreakdown.negative,
          sentimentBreakdown.neutral,
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(156, 163, 175, 1)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || ''
            const value = context.parsed || 0
            const total =
              sentimentBreakdown.positive +
              sentimentBreakdown.negative +
              sentimentBreakdown.neutral
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${value} (${percentage}%)`
          },
        },
      },
    },
  }

  const total =
    sentimentBreakdown.positive +
    sentimentBreakdown.negative +
    sentimentBreakdown.neutral

  return (
    <div>
      <div className="h-80 mb-6">
        <Doughnut data={data} options={options} />
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {sentimentBreakdown.positive}
          </div>
          <div className="text-sm text-gray-600">
            {((sentimentBreakdown.positive / total) * 100).toFixed(1)}% Positif
          </div>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {sentimentBreakdown.negative}
          </div>
          <div className="text-sm text-gray-600">
            {((sentimentBreakdown.negative / total) * 100).toFixed(1)}% Negatif
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">
            {sentimentBreakdown.neutral}
          </div>
          <div className="text-sm text-gray-600">
            {((sentimentBreakdown.neutral / total) * 100).toFixed(1)}% Netral
          </div>
        </div>
      </div>
    </div>
  )
}