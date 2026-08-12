import type { Metadata } from 'next'
import { SHOP, ADDRESS_ONE_LINE, DIRECTIONS_URL, yearsOpen } from '@/lib/shop'
import { OpenBadge } from '@/components/OpenBadge'
import { Cinematic } from '@/components/Cinematic'

export const metadata: Metadata = {
  title: 'Visit — 150 Dorset St, South Burlington VT',
  description: `Sweet G's Smoke Shop is at ${ADDRESS_ONE_LINE}. Open Mon–Fri 10AM–8PM, Sat 11AM–8PM, Sun 11AM–5PM. Call ${SHOP.phone}.`,
  alternates: { canonical: '/visit' },
}

export default function VisitPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <Cinematic src="/video/counter.mp4" poster="/video/counter.jpg" scrim="full" rate={0.7} />
        <div className="wrap relative pb-16 pt-36 md:pb-24 md:pt-44">
          <p className="eyebrow eyebrow-rule">Come see us</p>
          <h1 className="display mt-6 text-[clamp(2.6rem,7vw,5rem)] text-foreground">150 Dorset St.</h1>
          <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">
            South Burlington, Vermont. {yearsOpen()} years in the same spot, parking out front, and
            somebody behind the counter who&rsquo;d genuinely rather talk to you.
          </p>
          <div className="mt-8">
            <OpenBadge />
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background py-16 md:py-24">
        <div className="wrap grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="eyebrow eyebrow-rule">Hours</h2>
            <dl className="mt-7 border-t border-border">
              {SHOP.hours.map((h) => (
                <div key={h.days} className="flex items-baseline justify-between gap-6 border-b border-border py-4">
                  <dt className="display text-xl text-foreground">{h.days}</dt>
                  <dd className="font-mono text-[12px] tabular-nums text-primary">{h.label}</dd>
                </div>
              ))}
            </dl>

            <h2 className="eyebrow eyebrow-rule mt-14">Find us</h2>
            <address className="mt-6 space-y-4 not-italic leading-relaxed text-muted-foreground">
              <p className="text-lg text-foreground">
                {SHOP.address.street}
                <br />
                {SHOP.address.locality}, {SHOP.address.regionLong} {SHOP.address.postalCode}
              </p>
              <p>
                <a href={SHOP.phoneHref} className="text-primary hover:underline">
                  {SHOP.phone}
                </a>
              </p>
            </address>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-primary bg-primary px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-85"
              >
                Get directions
              </a>
              <a
                href={SHOP.phoneHref}
                className="border border-border px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground transition-colors hover:border-border"
              >
                Call the shop
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* A static link rather than an embedded map iframe: a third-party
                frame drags tracking cookies and a consent banner into a page
                whose only job is "here is where we are". */}
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative grid aspect-4/3 place-items-center overflow-hidden border border-border plate"
            >
              <div className="relative text-center">
                <p className="display text-4xl text-foreground">Dorset St</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  South Burlington, VT
                </p>
                <span className="mt-7 inline-flex items-center gap-2 border border-border px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground transition-colors group-hover:border-primary group-hover:text-primary">
                  Open in Maps
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </a>

            <div className="border border-border bg-card p-7">
              <h3 className="eyebrow">Not sure what you need?</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                That&rsquo;s the normal way to walk in. Tell us how you&rsquo;ll use it and
                we&rsquo;ll point you at the right thing — including the cheap one, when
                that&rsquo;s the right thing.
              </p>
            </div>

            <div className="border border-border bg-card p-7">
              <h3 className="eyebrow">Follow along</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                New glass, new drops, and whatever came through the door this week.
              </p>
              <div className="mt-5 flex gap-2">
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
          </div>
        </div>
      </section>
    </>
  )
}
