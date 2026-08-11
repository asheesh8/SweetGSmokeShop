/**
 * ⚠️  PLACEHOLDER INVENTORY — READ BEFORE LAUNCH
 *
 * The categories and carried brands below are real: they come straight from
 * Sweet G's BBB listing and their own site. The individual items are NOT real
 * inventory — they're representative stand-ins so the shop layout can be built
 * and reviewed. Swap them for actual stock before this goes live.
 *
 * Deliberately, nothing here carries a price. Every CTA is "ask in store",
 * which is both the honest thing to publish for stock we haven't confirmed and
 * the right call for a category no mainstream payment processor will touch.
 * When real pricing arrives, add a `price` field and surface it in ProductCard.
 */

export type Category = {
  slug: string
  name: string
  blurb: string
  /** Palette key used for the category's card treatment. */
  tint: 'magenta' | 'tangerine' | 'buzz' | 'seafoam' | 'olive' | 'uv'
  sticker: 'skull' | 'leaf' | 'shrooms' | 'sun' | 'lamp' | 'smoke'
}

export const CATEGORIES: Category[] = [
  {
    slug: 'glass',
    name: 'Glass',
    blurb:
      'Water pipes, hand pipes, bubblers and rigs. Heady one-offs from local makers sit next to workhorse daily drivers — come look through the case.',
    tint: 'seafoam',
    sticker: 'lamp',
  },
  {
    slug: 'vaporizers',
    name: 'Vaporizers & Batteries',
    blurb:
      'Dry herb and concentrate vaporizers, 510 batteries, pods, coils and chargers. We will walk you through the difference instead of pointing at a shelf.',
    tint: 'uv',
    sticker: 'smoke',
  },
  {
    slug: 'cbd',
    name: 'CBD',
    blurb:
      'Tinctures, edibles, topicals and flower. Vermont-made where we can get it. Ask us what is actually in it — we read the COAs so you do not have to.',
    tint: 'olive',
    sticker: 'leaf',
  },
  {
    slug: 'art',
    name: 'Local Art',
    blurb:
      'Local and American-made art, prints and oddities. The walls change constantly because we buy from people who walk in the door.',
    tint: 'tangerine',
    sticker: 'sun',
  },
  {
    slug: 'apparel',
    name: 'Vintage & Custom Clothing',
    blurb:
      'Real Bud Camo, Backwoods, NEVA NUDE and Queen City, plus vintage we pick ourselves and customs you will not find anywhere else in Vermont.',
    tint: 'magenta',
    sticker: 'skull',
  },
  {
    slug: 'accessories',
    name: 'Smoke Shop Staples',
    blurb:
      'Grinders, papers, wraps, torches, trays, screens, cleaners. The unglamorous half of the shop that you actually run out of.',
    tint: 'buzz',
    sticker: 'shrooms',
  },
]

export type Product = {
  slug: string
  name: string
  category: string
  /** One-line hook shown on the card. */
  hook: string
  /** Longer copy on the detail page. */
  body: string
  /** Bullet spec lines. */
  details: string[]
  /** Optional 3D model shown in the detail viewer. */
  model?: string
  /** Marks stock we know rotates fast, so the copy can say so honestly. */
  rotates?: boolean
  brand?: string
}

export const PRODUCTS: Product[] = [
  {
    slug: 'heady-beaker',
    name: 'Heady Beaker',
    category: 'glass',
    hook: 'Local borosilicate, iridescent, one of one.',
    body: 'Beaker-base water pipe blown by a Vermont maker. Thick joint, ice pinch, and a colour shift that changes depending on where you stand. Because these are one-offs, what is in the case this week is not what was in it last week.',
    details: ['Borosilicate glass', '14mm joint', 'Ice pinch', 'One of one — stock rotates weekly'],
    rotates: true,
  },
  {
    slug: 'daily-driver-bubbler',
    name: 'Daily Driver Bubbler',
    category: 'glass',
    hook: 'The one you actually use every day.',
    body: 'Compact, thick-walled, and hard to knock over. Not precious, easy to clean, and priced so it is not a tragedy when it goes. We keep several in stock at all times.',
    details: ['Thick-walled boro', 'Fixed stem', 'Fits standard screens', 'Multiple colourways in stock'],
  },
  {
    slug: 'hand-pipe-case',
    name: 'Hand Pipes',
    category: 'glass',
    hook: 'A whole case of them. Go pick one up.',
    body: 'Spoons, chillums, sherlocks, and whatever the local blowers dropped off this month. This is the case people spend twenty minutes in front of, and we do not rush anybody.',
    details: ['Dozens in stock', 'Local and imported', 'Every price point', 'Pick it up before you buy it'],
    rotates: true,
  },
  {
    slug: 'dry-herb-vaporizer',
    name: 'Dry Herb Vaporizers',
    category: 'vaporizers',
    hook: 'Convection, conduction, and which one you actually want.',
    body: 'Portable and desktop units. The honest answer is that the right one depends on how you use it, so come in and tell us — we will talk you out of the expensive one if the cheap one suits you better.',
    details: ['Portable and desktop', 'Convection and conduction', 'Replacement screens and stems', 'We demo before you buy'],
  },
  {
    slug: 'batteries',
    name: '510 Batteries & Pods',
    category: 'vaporizers',
    hook: 'Batteries, chargers, coils, pods. All of it.',
    body: 'Variable voltage batteries, buttonless draws, USB-C chargers, and replacement coils for the systems people around here actually run. If yours died, bring the old one in so we can match it.',
    details: ['Variable voltage options', 'USB-C charging', 'Replacement coils and pods', 'Bring your old one for a match'],
  },
  {
    slug: 'cbd-tincture',
    name: 'CBD Tinctures',
    category: 'cbd',
    hook: 'Full spectrum, broad spectrum, isolate — explained properly.',
    body: 'A range of strengths and formulations, Vermont-made where we can source it. We keep the certificates of analysis behind the counter and we will show them to you, because "trust me" is not an ingredient list.',
    details: ['Multiple strengths', 'Vermont-made where available', 'COAs available in store', 'Full, broad and isolate'],
  },
  {
    slug: 'cbd-topicals',
    name: 'CBD Topicals & Edibles',
    category: 'cbd',
    hook: 'Balms, salves, gummies, chocolate.',
    body: 'For people who want the category without the inhale. Ask what is actually in it — we would rather spend ten minutes explaining than sell you the wrong thing once.',
    details: ['Balms and salves', 'Gummies and chocolate', 'Dose clearly labelled', 'Ask us anything'],
  },
  {
    slug: 'local-art',
    name: 'Local & American-Made Art',
    category: 'art',
    hook: 'Bought from people who walked in the door.',
    body: 'Prints, originals, stickers and oddities from Vermont artists and American makers. The wall changes constantly. If you make things and you are local, come talk to us — this is genuinely how most of it gets here.',
    details: ['Vermont artists', 'American-made', 'Originals and prints', 'Artists: come talk to us'],
    rotates: true,
  },
  {
    slug: 'real-bud-camo',
    name: 'Real Bud Camo',
    category: 'apparel',
    brand: 'Real Bud Camo',
    hook: 'The camo everybody asks about.',
    body: 'One of the four clothing lines we carry, and the one people come in specifically looking for. Sizes move fast — call ahead if you are driving in for something particular.',
    details: ['Tees and hoodies', 'Sizes rotate quickly', 'Call ahead for specific sizes'],
    rotates: true,
  },
  {
    slug: 'queen-city',
    name: 'Queen City',
    category: 'apparel',
    brand: 'Queen City',
    hook: 'Burlington on your chest.',
    body: 'Local-pride apparel for people who actually live here. Alongside Backwoods and NEVA NUDE on the rack, plus the vintage we pick ourselves.',
    details: ['Local Burlington label', 'Tees and outerwear', 'Stocked alongside Backwoods and NEVA NUDE'],
  },
  {
    slug: 'vintage-custom',
    name: 'Vintage & Customs',
    category: 'apparel',
    hook: 'Picked by us. One of each, mostly.',
    body: 'Vintage we source ourselves and custom pieces you will not find at another shop in Vermont. Almost all of it is single-piece, so if you like it, that is the moment.',
    details: ['Single-piece vintage', 'Custom work', 'Changes constantly'],
    rotates: true,
  },
  {
    slug: 'grinders',
    name: 'Grinders',
    category: 'accessories',
    hook: 'Buy the one that outlives your car.',
    body: 'Two-piece up to four-piece with a kief catch, in anodised aluminium and wood. The cheap ones strip their threads within a year — we will show you the difference in your hand.',
    details: ['Two to four piece', 'Anodised aluminium and wood', 'Kief catches', 'Feel the difference in store'],
  },
  {
    slug: 'papers-wraps',
    name: 'Papers, Wraps & Cones',
    category: 'accessories',
    hook: 'Including the Backwoods you came in for.',
    body: 'Full wall of papers, wraps, cones, tips and filters. This is the thing you run out of at the worst possible time, and we are open until 8 most nights.',
    details: ['Papers, wraps, cones, tips', 'Backwoods stocked', 'Open till 8PM Mon–Sat'],
  },
  {
    slug: 'torches-trays',
    name: 'Torches, Trays & Cleaning',
    category: 'accessories',
    hook: 'The unglamorous half of a good setup.',
    body: 'Torches and lighters, rolling trays, screens, brushes, and the cleaner that actually works on resin. Nobody photographs this stuff, everybody needs it.',
    details: ['Torches and lighters', 'Rolling trays', 'Screens and brushes', 'Cleaning solution that works'],
  },
]

export function productsIn(categorySlug: string): Product[] {
  return PRODUCTS.filter((p) => p.category === categorySlug)
}

export function productBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function categoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}

/**
 * The two 3D scans. Explicitly NOT catalogue items — Sweet G's is a tobacco
 * store, not a dispensary, and presenting flower as purchasable stock would be
 * wrong on both counts. They exist here as the site's hero objects and as an
 * exhibit you can pick up and turn over.
 */
export const SPECIMENS = [
  {
    id: 'moon',
    name: 'Moon Monkey',
    model: '/models/moon_nonkey_nug.glb',
    note: 'Dense, fist-shaped, absolutely coated. Scanned at 47,000 triangles — every hair on it is real geometry, not a texture.',
  },
  {
    id: 'alien',
    name: 'Alien ATH',
    model: '/models/alien_ath_nug.glb',
    note: 'Longer, looser, wilder pistils. Turn it toward the light and the trichomes actually catch.',
  },
] as const
