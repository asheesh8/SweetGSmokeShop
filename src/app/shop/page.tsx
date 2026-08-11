import type { Metadata } from 'next'
import { Store } from '@/components/shop/Store'
import { Cinematic } from '@/components/Cinematic'
import { SHOP } from '@/lib/shop'

export const metadata: Metadata = {
  title: 'The Shop — Glass, Vapes, CBD, Art & Clothing',
  description: `Browse everything Sweet G's carries in South Burlington VT: glass, vaporizers and batteries, CBD, local art, and vintage & custom clothing including Real Bud Camo, Backwoods, NEVA NUDE and Queen City.`,
  alternates: { canonical: '/shop' },
}

export default function ShopPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <Cinematic src="/video/glass.mp4" poster="/video/glass.jpg" scrim="full" rate={0.7} />
        <div className="wrap relative pb-14 pt-32 md:pb-16 md:pt-40">
          <p className="eyebrow eyebrow-rule">Everything we carry</p>
          <h1 className="display mt-5 max-w-3xl text-[clamp(2.4rem,6.5vw,4.4rem)]">The Shop</h1>
          <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">
            Search it, filter it, and put anything on your hold list — we&rsquo;ll set it aside
            behind the counter. No payment online; you pay when you pick it up. Call {SHOP.phone}{' '}
            if you&rsquo;re in a hurry.
          </p>
        </div>
      </section>

      <div className="border-t border-border">
        <Store />
      </div>
    </>
  )
}
