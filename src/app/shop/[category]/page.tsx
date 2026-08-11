import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CATEGORIES, categoryBySlug, productsIn } from '@/lib/products'
import { ProductTile } from '@/components/shop/ProductTile'
import { Cinematic } from '@/components/Cinematic'
import { SHOP } from '@/lib/shop'

type Params = { params: Promise<{ category: string }> }

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await params
  const c = categoryBySlug(category)
  if (!c) return {}
  return {
    title: `${c.name} in South Burlington, VT`,
    description: c.blurb,
    alternates: { canonical: `/shop/${c.slug}` },
  }
}

export default async function CategoryPage({ params }: Params) {
  const { category } = await params
  const c = categoryBySlug(category)
  if (!c) notFound()

  const items = productsIn(c.slug)
  const others = CATEGORIES.filter((x) => x.slug !== c.slug)

  return (
    <>
      <section className="relative overflow-hidden">
        <Cinematic src="/video/counter.mp4" poster="/video/counter.jpg" scrim="full" rate={0.7} />
        <div className="wrap relative pb-14 pt-36 md:pb-20 md:pt-44">
          <nav aria-label="Breadcrumb" className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <Link href="/shop" className="hover:text-foreground">
              The Shop
            </Link>
            <span className="px-2" aria-hidden="true">/</span>
            <span className="text-muted-foreground">{c.name}</span>
          </nav>
          <h1 className="display mt-5 max-w-3xl text-[clamp(2.3rem,6vw,4.2rem)] text-foreground">{c.name}</h1>
          <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">{c.blurb}</p>
        </div>
      </section>

      <section className="border-t border-border bg-background py-16 md:py-24">
        <div className="wrap">
          {items.length > 0 ? (
            <div className="grid gap-px bg-card/10 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p, i) => (
                <ProductTile key={p.slug} p={p} index={i} />
              ))}
            </div>
          ) : (
            <p className="max-w-lg leading-relaxed text-muted-foreground">
              This case changes constantly — call {SHOP.phone} and we&rsquo;ll tell you
              what&rsquo;s in today.
            </p>
          )}

          <div className="mt-16 border-t border-border pt-10">
            <h2 className="eyebrow">Keep looking</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={`/shop/${o.slug}`}
                    className="block border border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {o.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
