/**
 * Single source of truth for Sweet G's real-world details.
 *
 * Everything here is verified against the business's BBB profile and its own
 * site as of August 2026. NAP (name / address / phone) consistency is the
 * single biggest lever in local SEO — if any of this changes, change it HERE
 * and nowhere else. It feeds the nav, the footer, the visit page, the reserve
 * form's confirmation copy, and the LocalBusiness JSON-LD.
 */

export const SHOP = {
  legalName: "Sweet G Smoke Shop LLC",
  name: "Sweet G's Smoke Shop",
  shortName: "Sweet G's",
  tagline: "Not Your Average Smoke Shop, We Smoke In Style!",

  address: {
    street: '150 Dorset St',
    locality: 'South Burlington',
    region: 'VT',
    regionLong: 'Vermont',
    postalCode: '05403',
    country: 'US',
  },

  /** Approximate storefront coordinates for Dorset St, South Burlington. */
  geo: { lat: 44.4593, lng: -73.1787 },

  phone: '(802) 497-0193',
  phoneHref: 'tel:+18024970193',

  established: 2018,
  bbb: {
    rating: 'A+',
    accreditedSince: 2019,
    profileUrl:
      'https://www.bbb.org/us/vt/south-burlington/profile/tobacco-store/sweet-g-smoke-shop-llc-0021-440598',
  },

  social: {
    instagram: 'https://instagram.com/sweetgsmokeshop/',
    facebook: 'https://facebook.com/sweetGSmokeshop/',
  },

  /** Displayed on the visit page and emitted as schema.org openingHours. */
  hours: [
    { days: 'Mon — Fri', open: '10:00', close: '20:00', label: '10AM – 8PM', schema: ['Mo', 'Tu', 'We', 'Th', 'Fr'] },
    { days: 'Saturday', open: '11:00', close: '20:00', label: '11AM – 8PM', schema: ['Sa'] },
    { days: 'Sunday', open: '11:00', close: '17:00', label: '11AM – 5PM', schema: ['Su'] },
  ],

  minimumAge: 21,
} as const

export const ADDRESS_ONE_LINE = `${SHOP.address.street}, ${SHOP.address.locality}, ${SHOP.address.region} ${SHOP.address.postalCode}`

export const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${SHOP.legalName}, ${ADDRESS_ONE_LINE}`,
)}`

/** Years the shop has been open, computed so it never goes stale in copy. */
export function yearsOpen(now: Date = new Date()): number {
  return now.getFullYear() - SHOP.established
}

type HourRow = (typeof SHOP.hours)[number]

function rowForDay(day: number): HourRow | undefined {
  const key = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][day]
  return SHOP.hours.find((h) => (h.schema as readonly string[]).includes(key))
}

/**
 * Open/closed state for the "we're open right now" badge.
 *
 * Deliberately computed from a caller-supplied Date so the server and client
 * can't disagree — the badge renders as `null` until the client passes a real
 * local time, which sidesteps a hydration mismatch and the fact that the
 * server's timezone is not the shop's.
 */
export function openState(now: Date): { open: boolean; until: string; next: string } {
  const row = rowForDay(now.getDay())
  const minutes = now.getHours() * 60 + now.getMinutes()

  if (row) {
    const [oh, om] = row.open.split(':').map(Number)
    const [ch, cm] = row.close.split(':').map(Number)
    if (minutes >= oh * 60 + om && minutes < ch * 60 + cm) {
      return { open: true, until: row.label.split('–')[1].trim(), next: '' }
    }
  }

  for (let i = 1; i <= 7; i++) {
    const cand = rowForDay((now.getDay() + i) % 7)
    if (cand) {
      const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
        (now.getDay() + i) % 7
      ]
      return { open: false, until: '', next: `${i === 1 ? 'tomorrow' : dayName} at ${cand.label.split('–')[0].trim()}` }
    }
  }
  return { open: false, until: '', next: '' }
}
