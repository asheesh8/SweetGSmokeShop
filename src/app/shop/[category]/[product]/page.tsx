import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PRODUCTS, categoryBySlug, productBySlug, productsIn } from '@/lib/products'
import { ProductTile } from '@/components/shop/ProductTile'
import { ReserveForm } from '@/components/ReserveForm'
import { SHOP, DIRECTIONS_URL } from '@/lib/shop'

type Params = { params: Promise<{ category: string; product: string }> }

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ category: p.category, product: p.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { product } = await params
  const p = productBySlug(product)
  if (!p) return {}
  return {
    title: p.name,
    description: `${p.hook} ${p.body.slice(0, 110)}… Available at Sweet G's, 150 Dorset St, South Burlington VT.`,
    alternates: { canonical: `/shop/${p.category}/${p.slug}` },
  }
}

export default async function ProductPage({ params }: Params) {
  const { product } = await params
  const p = productBySlug(product)
  if (!p) notFound()

  const c = categoryBySlug(p.category)
  const related = productsIn(p.category).filter((x) => x.slug !== p.slug).slice(0, 3)

  return (
    <>
      <section className="bg-background pb-20 pt-32 md:pt-40">
        <div className="wrap grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <nav aria-label="Breadcrumb" className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              <Link href="/shop" className="hover:text-foreground">The Shop</Link>
              <span className="px-2" aria-hidden="true">/</span>
              <Link href={`/shop/${p.category}`} className="hover:text-foreground">{c?.name}</Link>
            </nav>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {p.brand && (
                <span className="border border-primary/40 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
                  {p.brand}
                </span>
              )}
              {p.rotates && (
                <span className="border border-border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                  Stock rotates
                </span>
              )}
            </div>

            <h1 className="display mt-5 text-[clamp(2.2rem,5.5vw,3.8rem)] text-foreground">{p.name}</h1>
            <p className="mt-4 text-lg text-primary">{p.hook}</p>
            <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">{p.body}</p>

            <ul className="mt-9 grid max-w-lg gap-px border border-border bg-card/10">
              {p.details.map((d) => (
                <li key={d} className="bg-card px-5 py-3.5 text-sm text-muted-foreground">
                  {d}
                </li>
              ))}
            </ul>

            <div className="mt-10 border border-border bg-card p-7">
              <h2 className="eyebrow">Why there&rsquo;s no price here</h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
                Most of what we carry is one-of-one or rotates weekly, and we&rsquo;d rather quote
                you honestly than publish a number that&rsquo;s wrong by the time you drive over.
                Ask below, or call {SHOP.phone} — we answer.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={SHOP.phoneHref}
                  className="border border-primary bg-primary px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-primary-foreground transition-opacity hover:opacity-85"
                >
                  Call the shop
                </a>
                <a
                  href={DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground transition-colors hover:border-border"
                >
                  Get directions
                </a>
              </div>
            </div>
          </div>

          <ReserveForm productName={p.name} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border bg-card py-16">
          <div className="wrap">
            <h2 className="eyebrow eyebrow-rule">More {c?.name.toLowerCase()}</h2>
            <div className="mt-8 grid gap-px bg-card/10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r, i) => (
                <ProductTile key={r.slug} p={r} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
