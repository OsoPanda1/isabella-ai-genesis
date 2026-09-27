import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Manrope, Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Isabella Villaseñor AI · Kernel Cognitivo Soberano',
  description:
    'Isabella Villaseñor AI — inteligencia cognitiva gobernada de Real del Monte, Hidalgo. Ocho habilidades cognitivas, Triple-Lock constitucional y gobernanza LUMEN auditable.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#1a1712',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${manrope.variable} ${cormorant.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
