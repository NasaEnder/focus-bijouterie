import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'Focus Bijouterie',
  description: 'Bijoux artisanaux sur mesure.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={geist.variable}>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-white text-gray-900">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
