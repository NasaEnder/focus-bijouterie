import type { Metadata } from 'next'
import { Anton, Geist, Sedgwick_Ave_Display, Space_Mono } from 'next/font/google'
import './globals.css'
import SprayDefs from '@/components/da/SprayDefs'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const anton = Anton({ subsets: ['latin'], weight: '400', variable: '--font-anton' })
const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-space-mono' })
const sedgwick = Sedgwick_Ave_Display({ subsets: ['latin'], weight: '400', variable: '--font-sedgwick' })

export const metadata: Metadata = {
  title: 'Focus Bijouterie',
  description: 'Bijoux artisanaux sur mesure.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${geist.variable} ${anton.variable} ${spaceMono.variable} ${sedgwick.variable}`}
    >
      <body className="min-h-screen flex flex-col font-sans antialiased bg-paper text-ink">
        <SprayDefs />
        {children}
      </body>
    </html>
  )
}
