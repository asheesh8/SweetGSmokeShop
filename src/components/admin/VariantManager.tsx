import { addVariants, toggleVariant, deleteVariant, clearSoldOutVariants } from '@/app/admin/actions'
import { formatPrice } from '@/lib/inventory'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type Variant = {
  id: string
  name: string
  price_cents: number | null
  in_stock: boolean
}

/**
 * Flavours, sizes, colourways.
 *
 * Built for the way Sweet G's actually posts: a drop lands, they list eight
 * flavours at once, and over the week each one sells out. So adding is
 * bulk-paste (newlines or commas), marking sold out is a single tap that
 * hides it from customers without losing the name, and there's one button to
 * sweep the sold-out ones when the shelf is refilled.
 */
export function VariantManager({
  productId,
  variants,
}: {
  productId: string
  variants: Variant[]
}) {
  const inStock = variants.filter((v) => v.in_stock).length
  const soldOut = variants.length - inStock

  return (
    <section className="border-t border-border pt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="display text-2xl">Flavours &amp; variants</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Vape flavours, sizes, colours — anything customers ask for by name.
          </p>
        </div>
        {variants.length > 0 && (
          <p className="font-mono text-[11px] text-muted-foreground">
            {inStock} in stock
            {soldOut > 0 && ` · ${soldOut} sold out`}
          </p>
        )}
      </div>

      {variants.length > 0 && (
        <ul className="mt-6 divide-y divide-border border border-border">
          {variants.map((v) => (
            <li
              key={v.id}
              className={`flex flex-wrap items-center gap-3 bg-card px-4 py-2.5 ${
                v.in_stock ? '' : 'opacity-55'
              }`}
            >
              <span className={`flex-1 text-sm ${v.in_stock ? '' : 'line-through'}`}>{v.name}</span>

              <span className="font-mono text-[11px] text-muted-foreground">
                {v.price_cents != null ? formatPrice(v.price_cents) : ''}
              </span>

              <form action={toggleVariant}>
                <input type="hidden" name="id" value={v.id} />
                <input type="hidden" name="product_id" value={productId} />
                <input type="hidden" name="next" value={String(!v.in_stock)} />
                <Button type="submit" size="sm" variant={v.in_stock ? 'secondary' : 'outline'}>
                  {v.in_stock ? 'In stock' : 'Sold out'}
                </Button>
              </form>

              <form action={deleteVariant}>
                <input type="hidden" name="id" value={v.id} />
                <input type="hidden" name="product_id" value={productId} />
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  aria-label={`Delete ${v.name}`}
                  className="text-muted-foreground hover:text-destructive"
                >
                  ✕
                </Button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-[1.5fr_1fr]">
        <form action={addVariants} className="space-y-3">
          <input type="hidden" name="product_id" value={productId} />
          <div>
            <label htmlFor="names" className="eyebrow">
              Add flavours
            </label>
            <Textarea
              id="names"
              name="names"
              rows={4}
              required
              placeholder={'Blue Razz\nMango Ice\nGelato\nStrawberry Kiwi'}
              className="mt-2"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              One per line, or separated by commas — paste the whole drop at once.
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label htmlFor="vprice" className="eyebrow">
                Price each (optional)
              </label>
              <Input
                id="vprice"
                name="price"
                inputMode="decimal"
                placeholder="19.99"
                className="mt-2 w-32"
              />
            </div>
            <Button type="submit">Add them</Button>
          </div>
        </form>

        {soldOut > 0 && (
          <form action={clearSoldOutVariants} className="h-fit border border-border bg-card p-5">
            <input type="hidden" name="product_id" value={productId} />
            <p className="eyebrow">Restocked?</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Remove all {soldOut} sold-out {soldOut === 1 ? 'flavour' : 'flavours'} in one go, then
              paste in the new list.
            </p>
            <Button type="submit" variant="outline" size="sm" className="mt-4">
              Clear sold out
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}
