import type { Metadata, Viewport } from 'next'
import { Cairo, Inter } from 'next/font/google'
import { Toaster } from 'sonner'

import './globals.css'

import { REAL_LOGO_URL } from '@/lib/real-images'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-cairo',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gargabeta.pages.dev'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'جرجبيتا | لحوم طازجة ومصنعات — أسوان',
    template: '%s | جرجبيتا',
  },
  description:
    'جرجبيتا — لحوم بلدي طازجة ومصنعات مجهّزة يوميًا في أسوان: سجق، كفتة، برجر، بسطرمة، شاورما، ومشويات على الفحم. اطلب من الواتساب والتوصيل لحد باب البيت.',
  keywords: [
    'جرجبيتا',
    'مصنعات لحوم',
    'لحوم طازجة',
    'أسوان',
    'مشويات',
    'سجق بلدي',
    'كفتة',
    'توصيل أسوان',
  ],
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    url: siteUrl,
    siteName: 'جرجبيتا',
    title: 'جرجبيتا | لحوم طازجة ومصنعات — أسوان',
    description: 'لحوم بلدي ومصنعات مجهّزة يوميًا + مشويات على الفحم. اطلب من الواتساب.',
    images: [REAL_LOGO_URL],
  },
  icons: {
    icon: [
      { url: REAL_LOGO_URL, type: 'image/png' },
      { url: '/images/logo.jpeg', type: 'image/jpeg' },
    ],
    shortcut: REAL_LOGO_URL,
    apple: REAL_LOGO_URL,
  },
}

export const viewport: Viewport = {
  themeColor: '#1E8449',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  )
}
