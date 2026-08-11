import { NextResponse } from 'next/server'
import { SHOP } from '@/lib/shop'

export const runtime = 'nodejs'

/**
 * Reserve / enquiry endpoint.
 *
 * Deliberately does not touch payments. It emails the shop via Resend when
 * RESEND_API_KEY is present, and returns an honest 503 when it isn't — rather
 * than swallowing the message and showing the customer a success screen for a
 * hold that never reached anybody. The form surfaces the phone number in that
 * case, which is the outcome that actually helps them.
 */

const MAX = { name: 80, contact: 120, message: 800, product: 120 }

/** Crude in-process rate limit: enough to stop a script, not a cluster. */
const hits = new Map<string, number[]>()
const WINDOW_MS = 60_000
const LIMIT = 5

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  // Keep the map from growing without bound on a long-lived process.
  if (hits.size > 5000) hits.clear()
  return recent.length > LIMIT
}

function clean(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'

  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests. Give it a minute.' }, { status: 429 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 })
  }

  // Honeypot tripped — accept silently so the bot doesn't learn anything.
  if (clean(body.website, 50)) return NextResponse.json({ ok: true })

  const name = clean(body.name, MAX.name)
  const contact = clean(body.contact, MAX.contact)
  const message = clean(body.message, MAX.message)
  const product = clean(body.product, MAX.product)

  if (!name || !contact) {
    return NextResponse.json({ error: 'Name and a way to reach you are both required.' }, { status: 400 })
  }

  const to = process.env.SHOP_INBOX
  const key = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM

  if (!key || !to || !from) {
    // Not configured yet. Say so plainly instead of faking a send.
    console.warn('[reserve] Email not configured — set RESEND_API_KEY, RESEND_FROM and SHOP_INBOX.')
    return NextResponse.json(
      { error: `Our hold form isn't hooked up yet.` },
      { status: 503 },
    )
  }

  const html = `
    <h2>Hold request — ${escapeHtml(product) || 'general enquiry'}</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Contact:</strong> ${escapeHtml(contact)}</p>
    <p><strong>Message:</strong><br>${escapeHtml(message) || '<em>none</em>'}</p>
    <hr>
    <p style="color:#666;font-size:12px">Sent from ${SHOP.name} website · ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}</p>
  `

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        // Lets the shop hit reply and land on the customer.
        reply_to: contact.includes('@') ? contact : undefined,
        subject: `Hold request: ${product || 'general'} — ${name}`,
        html,
      }),
    })

    if (!res.ok) {
      console.error('[reserve] Resend rejected the send:', res.status, await res.text())
      return NextResponse.json({ error: `We couldn't get that through.` }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[reserve] send failed:', err)
    return NextResponse.json({ error: `We couldn't get that through.` }, { status: 502 })
  }
}
