import { SHOP, ADDRESS_ONE_LINE, DIRECTIONS_URL } from '@/lib/shop'

/**
 * Live Google map of the storefront.
 *
 * Uses the keyless `maps.google.com/…&output=embed` endpoint so this works
 * today with no API key and no billing account. That endpoint is long-lived and
 * universally used, but it isn't the *documented* one — if it ever changes,
 * swap to the official Maps Embed API, which is the same iframe with
 * `https://www.google.com/maps/embed/v1/place?key=…&q=…`.
 *
 * `loading="lazy"` matters here: this is below the fold on the visit page, and
 * an eagerly-loaded map frame is several hundred KB and a third-party
 * connection before anyone has scrolled to it.
 *
 * The map ships light. In Nocturne a CSS filter inverts and re-rotates the hue
 * so it reads as a dark map rather than a glowing white rectangle in the middle
 * of a near-black page — see `.map-frame` in globals.css.
 */
export function MapEmbed({ className = '' }: { className?: string }) {
  const query = encodeURIComponent(
    `${SHOP.legalName}, ${SHOP.address.street}, ${SHOP.address.locality}, ${SHOP.address.region} ${SHOP.address.postalCode}`,
  )

  return (
    <div className={className}>
      <div className="relative aspect-4/3 overflow-hidden border border-border bg-card">
        <iframe
          // A screen-reader user needs to know what this frame is before
          // deciding whether to enter it.
          title={`Map of ${SHOP.name}, ${ADDRESS_ONE_LINE}`}
          src={`https://maps.google.com/maps?q=${query}&z=16&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="map-frame absolute inset-0 h-full w-full border-0"
        />
      </div>

      {/* The embed can't hand off to turn-by-turn, so the real directions link
          stays — and it's what most people on a phone actually want. */}
      <a
        href={DIRECTIONS_URL}
        target="_blank"
        rel="noopener noreferrer"
        // Stacks on narrow columns. Side by side, the Anton address ran to four
        // lines and collided with the "Directions" label.
        className="group mt-3 flex flex-col gap-3 border border-border bg-card px-5 py-4 transition-colors hover:border-primary sm:flex-row sm:items-center sm:justify-between sm:gap-4"
      >
        <span className="min-w-0">
          <span className="display block text-base leading-tight sm:text-lg">
            {SHOP.address.street}, {SHOP.address.unit}
          </span>
          <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {SHOP.address.locality}, {SHOP.address.region} {SHOP.address.postalCode}
          </span>
        </span>
        <span className="shrink-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
          Directions{' '}
          <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden="true">
            &rarr;
          </span>
        </span>
      </a>
    </div>
  )
}
