import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getInventory } from '@/lib/inventory'
import { ProductTile } from '@/components/shop/ProductTile'
import { Cinematic } from '@/components/Cinematic'
import { SHOP } from '@/lib/shop'

type Params = { params: Promise<{ category: string }> }

// Inventory is edited from /admin all day, so these render per request rather
// than being frozen at build time.
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await params
  const { categories } = await getInventory()
  const c = categories.find((x) => x.slug === category)
  if (!c) return {}
  return {
    title: `${c.name} in South Burlington, VT`,
    description: c.blurb,
    alternates: { canonical: `/shop/${c.slug}` },
  }
}

export default async function CategoryPage({ params }: Params) {
  const { category } = await params
  const { items, categories } = await getInventory()

  const c = categories.find((x) => x.slug === category)
  if (!c) notFound()

  const inCat = items.filter((p) => p.categorySlug === c.slug)
  const others = categories.filter((x) => x.slug !== c.slug)

  return (
    <>
      <section className="relative overflow-hidden">
        <Cinematic src="/video/counter.mp4" poster="/img/counter.jpg" scrim="full" rate={0.7} />
        <div className="wrap relative pb-14 pt-36 md:pb-20 md:pt-44">
          <nav aria-label="Breadcrumb" className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <Link href="/shop" className="hover:text-foreground">
              The Shop
            </Link>
            <span className="px-2" aria-hidden="true">/</span>
            <span className="text-foreground">{c.name}</span>
          </nav>
          <h1 className="display mt-5 max-w-3xl text-[clamp(2.3rem,6vw,4.2rem)]">{c.name}</h1>
          <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">{c.blurb}</p>
        </div>
      </section>

      <section className="border-t border-border bg-background py-16 md:py-24">
        <div className="wrap">
          {inCat.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-9 lg:grid-cols-3">
              {inCat.map((p, i) => (
                <ProductTile key={p.slug} p={p} categories={categories} index={i} />
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
