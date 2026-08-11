'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useHoldList } from './HoldListProvider'
import { SHOP } from '@/lib/shop'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

/**
 * The hold list slide-out — the checkout analogue.
 *
 * Submits the whole list as one enquiry so the shop gets a single message they
 * can act on, rather than one email per item.
 */
export function HoldSheet() {
  const { items, remove, clear, open, setOpen } = useHoldList()
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)

    if (fd.get('website')) return // honeypot

    setBusy(true)
    try {
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: items.map((i) => i.name).join(', ') || 'General enquiry',
          name: fd.get('name'),
          contact: fd.get('contact'),
          message: fd.get('message'),
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')

      toast.success('Sent — we’ll be in touch', {
        description: `Your hold list is with the shop. Need it faster? Call ${SHOP.phone}.`,
      })
      clear()
      form.reset()
      setOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong.', {
        description: `Call ${SHOP.phone} and we’ll sort it out.`,
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle className="display text-2xl">Your hold list</SheetTitle>
          <SheetDescription>
            We&rsquo;ll put these behind the counter with your name on them. No payment, no
            account — just a hold.
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <p className="display text-xl text-muted-foreground">Nothing held yet</p>
            <p className="text-sm text-muted-foreground">
              Browse the shop and add anything you want set aside.
            </p>
            <Button variant="outline" className="mt-2" onClick={() => setOpen(false)}>
              Keep looking
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto">
              {items.map((i) => (
                <li key={i.slug} className="flex items-start justify-between gap-4 px-6 py-4">
                  <div>
                    <p className="font-medium">{i.name}</p>
                    <p className="eyebrow mt-1">{i.category}</p>
                  </div>
                  <button
                    onClick={() => remove(i.slug)}
                    className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-destructive"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <form onSubmit={submit} className="space-y-4 border-t border-border px-6 py-5">
              <div>
                <Label htmlFor="hl-name">Your name</Label>
                <Input id="hl-name" name="name" required maxLength={80} autoComplete="name" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="hl-contact">Phone or email</Label>
                <Input id="hl-contact" name="contact" required maxLength={120} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="hl-message">Anything specific?</Label>
                <Textarea
                  id="hl-message"
                  name="message"
                  rows={3}
                  maxLength={800}
                  placeholder="Size, colour, when you can come by…"
                  className="mt-1.5"
                />
              </div>
              <div className="hidden" aria-hidden="true">
                <label htmlFor="hl-website">Website</label>
                <input id="hl-website" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              <Button type="submit" disabled={busy} className="w-full">
                {busy ? 'Sending…' : `Hold ${items.length} item${items.length === 1 ? '' : 's'} for me`}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                You must be {SHOP.minimumAge}+ to purchase. Holds are a courtesy and aren&rsquo;t a
                guarantee of stock.
              </p>
            </form>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
