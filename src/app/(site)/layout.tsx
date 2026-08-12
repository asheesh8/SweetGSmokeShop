import { SHOP, ADDRESS_ONE_LINE } from '@/lib/shop'
import { HoldListProvider } from '@/components/hold/HoldListProvider'
import { AgeGate } from '@/components/AgeGate'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { getInventory } from '@/lib/inventory'

const SITE = 'https://www.sweetgsmokeshop.com'

/**
 * LocalBusiness structured data. For a business whose entire job is getting
 * people through one physical door, this markup does more than any copy on the
 * page — it's what feeds the map pack. Storefront only; /admin has no business
 * emitting it.
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
    email: SHOP.email,
    foundingDate: String(SHOP.established),
    priceRange: '$$',
    currenciesAccepted: 'USD',
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${SHOP.address.street}, ${SHOP.address.unit}`,
      addressLocality: SHOP.address.locality,
      addressRegion: SHOP.address.region,
      postalCode: SHOP.address.postalCode,
      addressCountry: SHOP.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: SHOP.geo.lat, longitude: SHOP.geo.lng },
    openingHoursSpecification: SHOP.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.schema.map(
      (d) =>
        `https://schema.org/${
          { Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday', Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday' }[d]
        }`,
      ),
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

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { announcement } = await getInventory()

  return (
    <HoldListProvider>
      <LocalBusinessJsonLd />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <AgeGate />
      <Nav announcement={announcement?.body ?? null} />
      <main id="main">{children}</main>
      <Footer />
    </HoldListProvider>
  )
}
