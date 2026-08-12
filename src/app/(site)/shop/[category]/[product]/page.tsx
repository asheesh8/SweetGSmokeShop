import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getInventory, formatPrice } from '@/lib/inventory'
import { ProductImage } from '@/components/shop/ProductImage'
import { ProductTile } from '@/components/shop/ProductTile'
import { ReserveForm } from '@/components/ReserveForm'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SHOP, DIRECTIONS_URL } from '@/lib/shop'

type Params = { params: Promise<{ category: string; product: string }> }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { product } = await params
  const { items } = await getInventory()
  const p = items.find((x) => x.slug === product)
  if (!p) return {}
  return {
    title: p.name,
    description: `${p.hook} ${p.body.slice(0, 110)}… Available at Sweet G's, ${SHOP.address.street}, South Burlington VT.`,
    alternates: { canonical: `/shop/${p.categorySlug}/${p.slug}` },
  }
}

export default async function ProductPage({ params }: Params) {
  const { product } = await params
  const { items, categories } = await getInventory()

  const p = items.find((x) => x.slug === product)
  if (!p) notFound()

  const c = categories.find((x) => x.slug === p.categorySlug)
  const related = items.filter((x) => x.categorySlug === p.categorySlug && x.slug !== p.slug).slice(0, 3)
  const available = p.variants.filter((v) => v.inStock)

  return (
    <>
      <section className="bg-background pb-20 pt-32 md:pt-40">
        <div className="wrap grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <nav aria-label="Breadcrumb" className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              <Link href="/shop" className="hover:text-foreground">The Shop</Link>
              <span className="px-2" aria-hidden="true">/</span>
              <Link href={`/shop/${p.categorySlug}`} className="hover:text-foreground">{c?.name}</Link>
            </nav>

            <div className="mt-6 aspect-4/3 overflow-hidden rounded-[var(--radius-md)] border border-border bg-card">
              <ProductImage
                src={p.imageUrl}
                name={p.name}
                category={c?.name ?? p.categorySlug}
                index={0}
                className={p.inStock ? '' : 'opacity-50 grayscale'}
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {p.brand && <Badge>{p.brand}</Badge>}
              {p.rotates && <Badge variant="secondary">Stock rotates</Badge>}
              {!p.inStock && <Badge variant="outline">Out of stock</Badge>}
            </div>

            <h1 className="display mt-4 text-[clamp(2.2rem,5.5vw,3.8rem)]">{p.name}</h1>
            <p className="mt-3 display text-2xl text-primary">{formatPrice(p.priceCents)}</p>
            {p.hook && <p className="mt-3 text-lg text-muted-foreground">{p.hook}</p>}
            {p.body && <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">{p.body}</p>}

            {available.length > 0 && (
              <div className="mt-8">
                <h2 className="eyebrow">In stock today</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {available.map((v) => (
                    <li
                      key={v.id}
                      className="border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em]"
                    >
                      {v.name}
                      {v.priceCents != null && (
                        <span className="ml-2 text-primary">{formatPrice(v.priceCents)}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {p.details.length > 0 && (
              <ul className="mt-9 grid max-w-lg gap-px border border-border bg-border">
                {p.details.map((d) => (
                  <li key={d} className="bg-card px-5 py-3.5 text-sm text-muted-foreground">
                    {d}
                  </li>
                ))}
              </ul>
            )}

            {p.priceCents == null && (
              <div className="mt-10 border border-border bg-card p-7">
                <h2 className="eyebrow">Why there&rsquo;s no price here</h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  This one is one-of-one or rotates weekly, and we&rsquo;d rather quote you honestly
                  than publish a number that&rsquo;s wrong by the time you drive over. Ask below, or
                  call {SHOP.phone} — we answer.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild>
                    <a href={SHOP.phoneHref}>Call the shop</a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer">
                      Get directions
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>

          <ReserveForm productName={p.name} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border bg-card py-16">
          <div className="wrap">
            <h2 className="eyebrow eyebrow-rule">More {c?.name.toLowerCase()}</h2>
            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-9 lg:grid-cols-3">
              {related.map((r, i) => (
                <ProductTile key={r.slug} p={r} categories={categories} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
