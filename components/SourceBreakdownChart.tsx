'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'
import type { SourceBreakdown } from '@/lib/types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface SourceBreakdownChartProps {
  sources: SourceBreakdown[]
}

export default function SourceBreakdownChart({
  sources,
}: SourceBreakdownChartProps) {
  if (!sources || sources.length === 0) {
    return <p className="text-gray-500 text-center py-8">Tidak ada data sumber</p>
  }

  const data = {
    labels: sources.map((s) => s.source),
    datasets: [
      {
        label: 'Jumlah Artikel',
        data: sources.map((s) => s.count),
        backgroundColor: 'rgba(37, 99, 235, 0.8)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 1,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Jumlah: ${context.parsed.y} artikel`
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  }

  return (
    <div>
      <div className="h-80 mb-4">
        <Bar data={data} options={options} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {sources.map((source, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-3 text-center"
          >
            <div className="text-xl font-bold text-blue-600">
              {source.count}
            </div>
            <div className="text-xs text-gray-600 truncate">{source.source}</div>
            <div className="text-xs text-gray-500 mt-1">
              Avg Sentiment: {source.avg_sentiment.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}