'use client'

import { useEffect, useState } from 'react'

/**
 * The "FLAVOR OF THE DAY" / "open till 9 tonight" strip.
 *
 * Sweet G's already runs their shop this way on Facebook — a near-daily post
 * about what just landed and how late they're open. This gives that the same
 * prominence on their own site, editable from /admin in about five seconds.
 *
 * Dismissal is remembered per message (keyed by content hash), so a customer
 * who closes today's note still sees tomorrow's.
 */
export function AnnouncementBar({ text }: { text: string | null }) {
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    if (!text) return
    const key = `sweetg:note:${hash(text)}`
    try {
      setDismissed(window.localStorage.getItem(key) === '1')
    } catch {
      setDismissed(false)
    }
  }, [text])

  if (!text || dismissed) return null

  const close = () => {
    try {
      window.localStorage.setItem(`sweetg:note:${hash(text)}`, '1')
    } catch {
      /* private mode — it'll just show again */
    }
    setDismissed(true)
  }

  return (
    <div className="fixed inset-x-0 top-0 z-[55] bg-primary text-primary-foreground">
      <div className="wrap flex items-center justify-between gap-4 py-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em]">{text}</p>
        <button
          onClick={close}
          aria-label="Dismiss announcement"
          className="shrink-0 font-mono text-[13px] leading-none opacity-70 transition-opacity hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

/** Tiny non-cryptographic hash — only needs to distinguish one note from another. */
function hash(s: string): string {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return Math.abs(h).toString(36)
}
