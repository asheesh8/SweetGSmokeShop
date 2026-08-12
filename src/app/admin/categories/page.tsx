import { createClient } from '@/lib/supabase/server'
import { saveCategory } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const supabase = await createClient()
  if (!supabase) return null

  const { data: cats } = await supabase
    .from('categories')
    .select('id, slug, name, blurb, products(count)')
    .order('sort', { ascending: true })

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow eyebrow-rule">Categories</p>
        <h1 className="display mt-4 text-3xl">The six walls</h1>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground">
          These are the filters customers browse by. You rarely need to change them — most changes
          belong in Inventory.
        </p>
      </div>

      <ul className="divide-y divide-border border border-border">
        {cats?.map((c) => {
          const count = (c.products as unknown as { count: number }[])?.[0]?.count ?? 0
          return (
            <li key={c.id} className="bg-card px-5 py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="display text-lg">{c.name}</h2>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {count} {count === 1 ? 'product' : 'products'}
                </span>
              </div>
              {c.blurb && <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{c.blurb}</p>}
            </li>
          )
        })}
      </ul>

      <form action={saveCategory} className="max-w-md space-y-4 border border-border bg-card p-6">
        <h2 className="display text-xl">Add a category</h2>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required placeholder="Kratom" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="blurb">One-liner</Label>
          <Input
            id="blurb"
            name="blurb"
            placeholder="What's in this part of the shop."
            className="mt-1.5"
          />
        </div>
        <Button type="submit">Add category</Button>
      </form>
    </div>
  )
}
