import type { Metadata, Viewport } from 'next'
import { Anton, Shrikhand, Space_Grotesk, Space_Mono } from 'next/font/google'
import './globals.css'
import { SHOP, ADDRESS_ONE_LINE } from '@/lib/shop'
import { ThemeProvider } from '@/components/ThemeProvider'
import { HoldListProvider } from '@/components/hold/HoldListProvider'
import { ChapterProvider } from '@/components/film/ChapterContext'
import { AgeGate } from '@/components/AgeGate'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
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

/**
 * LocalBusiness structured data. For a business whose entire job is getting
 * people through one physical door, this markup does more than any copy on the
 * page — it's what feeds the map pack.
 */
function LocalBusinessJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'TobaccoShop',
    '@id': `${SITE}/#shop`,
    name: SHOP.name,
    legalName: SHOP.legalName,
    slogan: SHOP.tagline,
    url: SITE,
    telephone: SHOP.phone,
    foundingDate: String(SHOP.established),
    priceRange: '$$',
    currenciesAccepted: 'USD',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SHOP.address.street,
      addressLocality: SHOP.address.locality,
      addressRegion: SHOP.address.region,
      postalCode: SHOP.address.postalCode,
      addressCountry: SHOP.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: SHOP.geo.lat, longitude: SHOP.geo.lng },
    openingHoursSpecification: SHOP.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.schema.map((d) => `https://schema.org/${
        { Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday', Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday' }[d]
      }`),
      opens: h.open,
      closes: h.close,
    })),
    sameAs: [SHOP.social.instagram, SHOP.social.facebook, SHOP.bbb.profileUrl],
    description: `Family-owned smoke shop at ${ADDRESS_ONE_LINE}. Tobacco products and accessories, glass, vaporizers and vape batteries, CBD, local and American-made art, and vintage and custom clothing.`,
  }
  return (
    <script
      type="application/ld+json"
      // Static, author-controlled object — no user input reaches this string.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
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
      <body className="grain">
        <LocalBusinessJsonLd />
        <ThemeProvider>
          <HoldListProvider>
            <ChapterProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
            >
              Skip to content
            </a>
            <AgeGate />
            <Nav />
            <main id="main">{children}</main>
            <Footer />
            <Toaster />
            </ChapterProvider>
          </HoldListProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
