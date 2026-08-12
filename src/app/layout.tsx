import type { Metadata, Viewport } from 'next'
import { Anton, Shrikhand, Space_Grotesk, Space_Mono } from 'next/font/google'
import './globals.css'
import { SHOP, ADDRESS_ONE_LINE } from '@/lib/shop'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'

/**
 * Type has to carry the personality — a default UI grotesk is the fastest way
 * to make a site look like nobody chose anything.
 *
 * Anton      heavy condensed poster caps. Nocturne's voice: title-card weight,
 *            reads as screen-printed rather than set in a design tool.
 * Shrikhand  fat, bulging, Cooper Black lineage. Hippie's voice.
 * Space Grotesk / Space Mono  quirky rather than neutral, so even body copy
 *            and the small labels have a fingerprint.
 */
const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-tight', display: 'swap' })
const groovy = Shrikhand({ weight: '400', subsets: ['latin'], variable: '--font-groovy', display: 'swap' })
const body = Space_Grotesk({ subsets: ['latin'], variable: '--font-body-face', display: 'swap' })
const mono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-mono-face', display: 'swap' })

const SITE = 'https://www.sweetgsmokeshop.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: `${SHOP.name} — Smoke Shop in South Burlington, VT`,
    template: `%s · ${SHOP.shortName}`,
  },
  description:
    `${SHOP.tagline} Family-run smoke shop on Dorset St in South Burlington, Vermont since ${SHOP.established}. Glass, vaporizers, CBD, local art, and vintage & custom clothing. BBB ${SHOP.bbb.rating} rated.`,
  keywords: [
    'smoke shop South Burlington',
    'smoke shop Burlington VT',
    'head shop Vermont',
    'glass pipes Burlington',
    'vaporizers Vermont',
    'CBD South Burlington',
    'Dorset Street smoke shop',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE,
    siteName: SHOP.name,
    title: `${SHOP.name} — ${SHOP.tagline}`,
    description: `Family-run smoke shop on Dorset St, South Burlington VT. Glass, vapes, CBD, local art, and vintage & custom clothing.`,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SHOP.name} — ${SHOP.tagline}`,
    description: 'Glass, vapes, CBD, local art and clothing on Dorset St, South Burlington VT.',
  },
  robots: { index: true, follow: true },
  category: 'shopping',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6ecd9' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0a09' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning is required by next-themes: it writes the theme
    // class onto <html> before React hydrates, to stop a flash of the wrong
    // personality. That write is the intended mismatch.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${anton.variable} ${groovy.variable} ${body.variable} ${mono.variable}`}
    >
      {/*
        Deliberately thin. The storefront chrome — age gate, nav, footer — lives
        in the (site) layout so /admin can render without any of it. An admin
        being asked to confirm they're 21 before editing prices would be absurd.
      */}
      <body className="grain">
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
