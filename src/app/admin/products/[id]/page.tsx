import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'
import { VariantManager } from '@/components/admin/VariantManager'
import { deleteProduct } from '../../actions'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  if (!supabase) return null

  const [{ data: product }, { data: categories }, { data: variants }] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).maybeSingle(),
    supabase.from('categories').select('id, name').order('sort', { ascending: true }),
    supabase
      .from('product_variants')
      .select('id, name, price_cents, in_stock, sort')
      .eq('product_id', id)
      .order('sort', { ascending: true }),
  ])

  if (!product) notFound()

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/products"
            className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-primary"
          >
            ← Inventory
          </Link>
          <h1 className="display mt-3 text-3xl">{product.name}</h1>
          <p className="mt-2 font-mono text-[11px] text-muted-foreground">/shop/…/{product.slug}</p>
        </div>

        <form action={deleteProduct}>
          <input type="hidden" name="id" value={product.id} />
          <Button type="submit" variant="destructive" size="sm">
            Delete
          </Button>
        </form>
      </div>

      <ProductForm product={product} categories={categories ?? []} />

      <VariantManager productId={product.id} variants={variants ?? []} />
    </div>
  )
}
