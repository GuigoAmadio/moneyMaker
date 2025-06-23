import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TenantProvider } from '@/hooks/useTenant'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'MoneyMaker - Serviços Digitais',
  description:
    'Especialistas em desenvolvimento web, mobile e consultoria digital',
  keywords: 'desenvolvimento web, mobile, consultoria digital, design',
  authors: [{ name: 'MoneyMaker' }],
  creator: 'MoneyMaker',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://moneymaker.com.br',
    title: 'MoneyMaker - Serviços Digitais',
    description:
      'Especialistas em desenvolvimento web, mobile e consultoria digital',
    siteName: 'MoneyMaker',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MoneyMaker - Serviços Digitais',
    description:
      'Especialistas em desenvolvimento web, mobile e consultoria digital',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className={inter.className}>
        <TenantProvider>{children}</TenantProvider>
      </body>
    </html>
  )
}
