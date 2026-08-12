'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { saveProduct, type ActionResult } from '@/app/admin/actions'
import { ImageUploader } from './ImageUploader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export type ProductDraft = {
  id?: string
  name?: string
  slug?: string
  category_id?: string | null
  brand?: string | null
  hook?: string | null
  body?: string | null
  details?: string[] | null
  price_cents?: number | null
  in_stock?: boolean
  rotates?: boolean
  featured?: boolean
  published?: boolean
  image_path?: string | null
}

function Toggle({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string
  label: string
  hint: string
  defaultChecked?: boolean
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 border border-border bg-card p-4">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 size-4 accent-[var(--primary)]"
      />
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>
      </span>
    </label>
  )
}

export function ProductForm({
  product,
  categories,
}: {
  product?: ProductDraft
  categories: { id: string; name: string }[]
}) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(saveProduct, null)
  const editing = Boolean(product?.id)

  return (
    <form action={action} className="space-y-8">
      {product?.id && <input type="hidden" name="id" value={product.id} />}

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={product?.name ?? ''}
              placeholder="Heady Beaker"
              className="mt-1.5"
              autoFocus={!editing}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="category_id">Category</Label>
              <select
                id="category_id"
                name="category_id"
                defaultValue={product?.category_id ?? ''}
                className="mt-1.5 h-10 w-full border border-border bg-background px-3 text-sm"
              >
                <option value="">— none —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="brand">Brand (optional)</Label>
              <Input
                id="brand"
                name="brand"
                defaultValue={product?.brand ?? ''}
                placeholder="Real Bud Camo"
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="hook">One-liner</Label>
            <Input
              id="hook"
              name="hook"
              defaultValue={product?.hook ?? ''}
              placeholder="Local borosilicate, iridescent, one of one."
              maxLength={120}
              className="mt-1.5"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Shown under the name on the shop grid.
            </p>
          </div>

          <div>
            <Label htmlFor="body">Description</Label>
            <Textarea
              id="body"
              name="body"
              rows={5}
              defaultValue={product?.body ?? ''}
              placeholder="The longer pitch. Talk like you would across the counter."
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="details">Spec lines</Label>
            <Textarea
              id="details"
              name="details"
              rows={4}
              defaultValue={(product?.details ?? []).join('\n')}
              placeholder={'14mm joint\nIce pinch\nOne of one'}
              className="mt-1.5 font-mono text-[13px]"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">One per line.</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <Label>Photo</Label>
            <div className="mt-1.5">
              <ImageUploader name="image_path" initialPath={product?.image_path ?? null} />
            </div>
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              inputMode="decimal"
              defaultValue={product?.price_cents != null ? (product.price_cents / 100).toFixed(2) : ''}
              placeholder="Leave blank for “Ask in store”"
              className="mt-1.5"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Dollars, e.g. <span className="font-mono">24.99</span>. Blank is fine — plenty of
              your stock is quoted in person.
            </p>
          </div>

          <div>
            <Label htmlFor="slug">URL slug</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={product?.slug ?? ''}
              placeholder="auto from the name"
              className="mt-1.5 font-mono text-[13px]"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Leave blank and we&rsquo;ll make one. Changing it later breaks existing links.
            </p>
          </div>

          <div className="space-y-2">
            <Toggle
              name="published"
              label="Show on the site"
              hint="Off keeps it saved here but hidden from customers."
              defaultChecked={product?.published ?? true}
            />
            <Toggle
              name="in_stock"
              label="In stock"
              hint="Off shows it as unavailable rather than removing it."
              defaultChecked={product?.in_stock ?? true}
            />
            <Toggle
              name="rotates"
              label="Stock rotates weekly"
              hint="Adds the “Rotates” badge."
              defaultChecked={product?.rotates ?? false}
            />
            <Toggle
              name="featured"
              label="Feature it"
              hint="Pushes it to the front of the shop grid."
              defaultChecked={product?.featured ?? false}
            />
          </div>
        </div>
      </div>

      {state && !state.ok && (
        <p role="alert" className="border border-destructive bg-destructive/10 px-4 py-3 text-sm">
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : editing ? 'Save changes' : 'Add product'}
        </Button>
        <Button asChild variant="ghost">
          <Link href="/admin/products">Cancel</Link>
        </Button>
      </div>
    </form>
  )
}
