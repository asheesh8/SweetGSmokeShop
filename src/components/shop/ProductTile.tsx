import Link from 'next/link'
import { CATEGORIES, type Product } from '@/lib/products'
import { ProductImage } from './ProductImage'
import { Badge } from '@/components/ui/badge'

/**
 * Simple linked tile for the category and product routes.
 *
 * Those pages exist for local search ("glass pipes Burlington") and deep links,
 * not as the primary way to browse — the store on the homepage handles that
 * with search, filters and hold-in-place. So this stays a plain link with no
 * client-side state.
 */
export function ProductTile({ p, index = 0 }: { p: Product; index?: number }) {
  const category = CATEGORIES.find((c) => c.slug === p.category)
  return (
    <Link href={`/shop/${p.category}/${p.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-border bg-card">
        <ProductImage
          slug={p.slug}
          name={p.name}
          category={category?.name ?? p.category}
          index={index}
          className="transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {p.rotates && (
          <Badge className="absolute left-3 top-3" variant="secondary">
            Rotates
          </Badge>
        )}
      </div>
      <div className="mt-3">
        {p.brand && <p className="eyebrow">{p.brand}</p>}
        <h3 className="display mt-1 text-lg leading-tight">{p.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.hook}</p>
      </div>
    </Link>
  )
}
