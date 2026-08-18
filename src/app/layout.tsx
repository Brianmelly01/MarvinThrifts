import type { Metadata, Viewport } from 'next'
import { Inter, Bebas_Neue } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { WhatsAppFloat } from '@/components/ui/WhatsAppFloat'
import { Toaster } from '@/components/ui/Toaster'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'Marvin Thrifts'
const storeUrl = process.env.NEXT_PUBLIC_STORE_URL || 'https://marvinthrifts.co.ke'
const tagline = process.env.NEXT_PUBLIC_STORE_TAGLINE || 'Pre-Loved. Authentic. One of One.'

export const metadata: Metadata = {
  metadataBase: new URL(storeUrl),
  title: {
    default: `${storeName} — ${tagline}`,
    template: `%s | ${storeName}`,
  },
  description:
    'Marvin Thrifts is Kenya\'s premium curated pre-loved footwear destination. Shop authentic second-hand sneakers, boots, and casual shoes in Nairobi and across Kenya.',
  keywords: [
    'thrift shoes Kenya',
    'second hand sneakers Kenya',
    'affordable sneakers Nairobi',
    'thrift sneakers Nairobi',
    'pre-owned shoes Kenya',
    'used sneakers Nairobi',
    'Marvin Thrifts',
    'Nike thrift Kenya',
    'Jordan thrift Kenya',
    'Adidas second hand Kenya',
  ],
  authors: [{ name: 'Marvin Thrifts', url: storeUrl }],
  creator: 'Marvin Thrifts',
  publisher: 'Marvin Thrifts',
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: storeUrl,
    siteName: storeName,
    title: `${storeName} — ${tagline}`,
    description: 'Premium curated pre-loved footwear. Carefully checked. Ready for a second life.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Marvin Thrifts — Premium Pre-Loved Footwear',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${storeName} — ${tagline}`,
    description: 'Premium curated pre-loved footwear. Quality checked. Ready for a second life.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icons/favicon.ico',
    shortcut: '/icons/favicon-16x16.png',
    apple: '/icons/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5F4F0' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable}`}>
      <body className="bg-off-white text-black antialiased">
        <Providers>
          <Navbar />
          <main className="pb-16 lg:pb-0">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppFloat />
          <MobileBottomNav />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
