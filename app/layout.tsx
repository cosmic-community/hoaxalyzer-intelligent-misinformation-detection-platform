import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CosmicBadge from '@/components/CosmicBadge'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hoaxalyzer - Intelligent Misinformation Detection',
  description:
    'Advanced NLP platform for detecting hoaxes and analyzing public sentiment on news articles and social media topics. Created by Parrosz.',
  keywords: [
    'hoax detection',
    'misinformation',
    'sentiment analysis',
    'NLP',
    'fact checking',
    'Indonesian news',
  ],
  authors: [{ name: 'Parrosz' }],
  creator: 'Parrosz',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  return (
    <html lang="en">
      <head>
        <script src="/dashboard-console-capture.js" />
      </head>
      <body className={inter.className}>
        {children}
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  )
}