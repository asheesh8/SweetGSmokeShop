'use client'

import { useState } from 'react'
import { SHOP } from '@/lib/shop'

type State = { kind: 'idle' | 'sending' | 'sent' } | { kind: 'error'; message: string }

const field =
  'mt-2 w-full border border-border bg-background px-3.5 py-3 text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted-foreground'
const label = 'block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground'

/**
 * Reserve / ask-about-it form.
 *
 * No money moves through this — it emails the shop so they can put something
 * behind the counter with a name on it. Deliberate: Stripe and PayPal both
 * prohibit tobacco and smoking accessories, so a real cart here would be a
 * compliance problem rather than a feature.
 */
export function ReserveForm({ productName }: { productName: string }) {
  const [state, setState] = useState<State>({ kind: 'idle' })

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)

    // Honeypot: bots fill every field, people never see this one.
    if (fd.get('website')) {
      setState({ kind: 'sent' })
      return
    }

    setState({ kind: 'sending' })
    try {
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: productName,
          name: fd.get('name'),
          contact: fd.get('contact'),
          message: fd.get('message'),
          website: fd.get('website'),
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) throw new Error(data.error || 'Something went wrong on our end.')
      setState({ kind: 'sent' })
      form.reset()
    } catch (err) {
      setState({ kind: 'error', message: err instanceof Error ? err.message : 'Something went wrong.' })
    }
  }

  if (state.kind === 'sent') {
    return (
      <div className="h-fit border border-primary/40 bg-card p-8">
        <p className="eyebrow text-primary">Got it</p>
        <h2 className="display mt-4 text-3xl text-foreground">We&rsquo;ll be in touch</h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Someone at the shop will get back to you about the {productName.toLowerCase()}. Need an
          answer faster? Call {SHOP.phone} — we actually answer.
        </p>
        <button
          onClick={() => setState({ kind: 'idle' })}
          className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-primary hover:underline"
        >
          Ask about something else
        </button>
      </div>
    )
  }

  const busy = state.kind === 'sending'

  return (
    <form onSubmit={onSubmit} className="h-fit border border-border bg-card p-7 md:p-8">
      <p className="eyebrow">Hold it for me</p>
      <h2 className="display mt-4 text-3xl text-foreground">Ask about this</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Tell us what you&rsquo;re after and we&rsquo;ll put it behind the counter with your name on
        it. No payment, no account — just a hold.
      </p>

      <div className="mt-8 space-y-5">
        <div>
          <label htmlFor="rf-name" className={label}>Your name</label>
          <input id="rf-name" name="name" required maxLength={80} autoComplete="name" className={field} />
        </div>

        <div>
          <label htmlFor="rf-contact" className={label}>Phone or email</label>
          <input id="rf-contact" name="contact" required maxLength={120} autoComplete="email" className={field} />
          <p className="mt-2 text-xs text-muted-foreground">
            However you&rsquo;d rather be reached. We don&rsquo;t add anyone to a list.
          </p>
        </div>

        <div>
          <label htmlFor="rf-message" className={label}>Anything specific?</label>
          <textarea
            id="rf-message"
            name="message"
            rows={4}
            maxLength={800}
            placeholder="Size, colour, when you can come by…"
            className={`${field} resize-y`}
          />
        </div>

        {/* Honeypot — hidden from real users, irresistible to bots. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="rf-website">Website</label>
          <input id="rf-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      {state.kind === 'error' && (
        <p role="alert" className="mt-6 border border-destructive bg-destructive/10 px-4 py-3 text-sm text-foreground">
          {state.message}{' '}
          <a href={SHOP.phoneHref} className="text-primary underline">
            Call {SHOP.phone} instead
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-8 w-full border border-primary bg-primary px-6 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? 'Sending…' : 'Put my name on it'}
      </button>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        You must be {SHOP.minimumAge}+ to purchase. Holds are courtesy only and aren&rsquo;t a
        guarantee of stock.
      </p>
    </form>
  )
}
