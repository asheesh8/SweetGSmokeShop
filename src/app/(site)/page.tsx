import Link from 'next/link'
import { Film } from '@/components/film/Film'
import { RitualDemo } from '@/components/ritual/RitualDemo'
import { Store } from '@/components/shop/Store'
import { getInventory } from '@/lib/inventory'
import { Button } from '@/components/ui/button'
import { SHOP, DIRECTIONS_URL, ADDRESS_ONE_LINE, yearsOpen } from '@/lib/shop'

const MARKS = [
  { k: String(yearsOpen()), v: 'Years on Dorset Street' },
  { k: SHOP.bbb.rating, v: `BBB rated, accredited ${SHOP.bbb.accreditedSince}` },
  { k: '4', v: 'Clothing labels you won’t find elsewhere in VT' },
  { k: '7', v: 'Days a week, open till 8 most nights' },
]

export default async function HomePage() {
  const { items, categories } = await getInventory()

  return (
    <>
      <Film />

      {/* Everything below the film sits on the theme background and scrolls
          over the fixed backdrop, which is what closes the film off. */}
      <div className="relative z-10 bg-background">
        {/* The whole inventory, searchable and filterable, right here. An
            earlier version showed four picks behind a "browse all" link, which
            meant the shop was a click away on the shop's own homepage. */}
        <section id="shop" className="border-t border-border">
          <div className="wrap pt-16 md:pt-20">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow eyebrow-rule">The whole shop</p>
                <h2 className="display mt-5 text-[clamp(2rem,4.6vw,3.2rem)]">
                  All {items.length} things, right here
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                Search it, filter it, and put anything on your hold list — we&rsquo;ll set it
                aside behind the counter. You pay when you pick it up.
              </p>
            </div>
          </div>
          <Store items={items} categories={categories} />
        </section>

        <RitualDemo />

        {/* ── Story ──────────────────────────────────────────── */}
        <section
          id="story"
          className="relative overflow-hidden border-t border-border bg-cover bg-fixed bg-center py-20 md:py-32"
          style={{ backgroundImage: 'url(/img/smoke.jpg)' }}
        >
          <div className="absolute inset-0 bg-background/88" aria-hidden="true" />

          <div className="wrap relative grid gap-14 lg:grid-cols-[1.25fr_1fr]">
            <div>
              <p className="eyebrow eyebrow-rule">Since {SHOP.established}</p>
              <h2 className="display mt-5 max-w-xl text-[clamp(2rem,4.6vw,3.2rem)]">
                A family shop that treats you like family
              </h2>
              <div className="mt-8 max-w-xl space-y-5 leading-relaxed text-muted-foreground">
                <p>
                  Sweet G&rsquo;s has been on Dorset Street for {yearsOpen()} years. Family-owned,
                  BBB {SHOP.bbb.rating} rated, accredited since {SHOP.bbb.accreditedSince}, and
                  built on the unfashionable idea that a smoke shop should actually explain things.
                </p>
                <p>
                  So we do. The difference between convection and conduction. Why the cheap grinder
                  strips its threads inside a year. What&rsquo;s really in the tincture, with the
                  paperwork to back it up. Nobody gets pointed at a shelf and left there.
                </p>
                <p className="text-foreground">
                  Come in, take your time, ask the dumb question. That&rsquo;s the whole business
                  model.
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-px self-start border border-border bg-border">
              {MARKS.map((m) => (
                <div key={m.v} className="bg-card p-6">
                  <dt className="display text-3xl text-primary">{m.k}</dt>
                  <dd className="mt-2 text-xs leading-relaxed text-muted-foreground">{m.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Visit ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-t border-border">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/img/counter.jpg)' }}
            aria-hidden="true"
          />
          <div className="scrim" aria-hidden="true" />

          <div className="wrap relative grid gap-12 py-24 md:py-32 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="eyebrow eyebrow-rule">Come see us</p>
              <h2 className="display mt-5 text-[clamp(2.2rem,6vw,4.2rem)]">150 Dorset St</h2>
              <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
                South Burlington, Vermont. Parking out front, open till 8 most nights, and always
                somebody behind the counter who&rsquo;d rather talk to you than look at their phone.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer">
                    Get directions
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href={SHOP.phoneHref}>{SHOP.phone}</a>
                </Button>
                <Button asChild variant="ghost" size="lg">
                  <Link href="/visit">Hours &amp; details &rarr;</Link>
                </Button>
              </div>

              <address className="mt-10 font-mono text-[10px] uppercase not-italic tracking-[0.16em] text-muted-foreground">
                {ADDRESS_ONE_LINE}
              </address>
            </div>

            <dl className="self-end rounded-[var(--radius-md)] border border-border bg-card/80 p-7 backdrop-blur-md">
              <h3 className="eyebrow">Hours</h3>
              <div className="mt-5 space-y-3">
                {SHOP.hours.map((h) => (
                  <div
                    key={h.days}
                    className="flex items-baseline justify-between gap-6 border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <dt className="text-sm text-muted-foreground">{h.days}</dt>
                    <dd className="font-mono text-[12px] tabular-nums">{h.label}</dd>
                  </div>
                ))}
              </div>
            </dl>
          </div>
        </section>
      </div>
    </>
  )
}
