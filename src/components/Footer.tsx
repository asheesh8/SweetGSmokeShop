import Link from 'next/link'
import { SHOP, ADDRESS_ONE_LINE, DIRECTIONS_URL, yearsOpen } from '@/lib/shop'
import { Wordmark } from '@/components/Wordmark'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr] md:py-20">
        <div>
          <Wordmark />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {SHOP.tagline}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Family-run on Dorset Street for {yearsOpen()} years. BBB {SHOP.bbb.rating} rated,
            accredited since {SHOP.bbb.accreditedSince}.
          </p>
          <div className="mt-7 flex gap-2">
            <a
              href={SHOP.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Instagram
            </a>
            <a
              href={SHOP.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Facebook
            </a>
          </div>
        </div>

        <div>
          <h2 className="eyebrow">Come see us</h2>
          <address className="mt-5 space-y-3 text-sm not-italic leading-relaxed text-muted-foreground">
            <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="block hover:text-foreground">
              {SHOP.address.street}
              <br />
              {SHOP.address.locality}, {SHOP.address.region} {SHOP.address.postalCode}
            </a>
            <a href={SHOP.phoneHref} className="block hover:text-foreground">
              {SHOP.phone}
            </a>
          </address>
          <dl className="mt-6 space-y-2 text-[13px] text-muted-foreground">
            {SHOP.hours.map((h) => (
              <div key={h.days} className="flex justify-between gap-4">
                <dt>{h.days}</dt>
                <dd className="tabular-nums">{h.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="eyebrow">Elsewhere</h2>
          <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
            <li><Link href="/shop" className="hover:text-foreground">The Shop</Link></li>
            <li><Link href="/#ritual" className="hover:text-foreground">The Ritual</Link></li>
            <li><Link href="/#story" className="hover:text-foreground">About</Link></li>
            <li><Link href="/visit" className="hover:text-foreground">Visit &amp; Hours</Link></li>
            <li>
              <a href={SHOP.bbb.profileUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                BBB Profile
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="wrap border-t border-border py-7">
        <p className="text-xs leading-relaxed text-muted-foreground">
          You must be {SHOP.minimumAge} or older to purchase tobacco products. {SHOP.legalName},{' '}
          {ADDRESS_ONE_LINE}. All products intended for legal use only. Nothing on this site is
          medical advice. &copy; {new Date().getFullYear()} {SHOP.legalName}.
        </p>
      </div>
    </footer>
  )
}
