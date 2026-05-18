import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'SkillSwap — Teach what you know. Learn what you need.',
  description: 'Peer-to-peer skill exchange platform for students',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className={`dark ${plusJakarta.variable}`}>
      <body className="bg-[#0D0D0D] text-[#F5F5F5] font-sans antialiased selection:bg-[#F59E0B]/30 selection:text-white">
        {children}
      </body>
    </html>
  )
}
