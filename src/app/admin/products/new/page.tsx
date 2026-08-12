import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'

export const dynamic = 'force-dynamic'

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: categories } = (await supabase
    ?.from('categories')
    .select('id, name')
    .order('sort', { ascending: true })) ?? { data: [] }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/products"
          className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-primary"
        >
          ← Inventory
        </Link>
        <h1 className="display mt-3 text-3xl">Add a product</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Name is the only thing required. Everything else can come later.
        </p>
      </div>

      <ProductForm categories={categories ?? []} />
    </div>
  )
}
