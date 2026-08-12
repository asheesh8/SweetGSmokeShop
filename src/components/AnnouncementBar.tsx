'use client'

import { useEffect, useState } from 'react'

/**
 * The "FLAVOR OF THE DAY" / "open till 9 tonight" strip.
 *
 * Rendered *inside* the nav header rather than as its own fixed element.
 * Two fixed bars both pinned to the top overlapped each other; stacking them in
 * one header means the nav can never be covered, whatever the strip's height.
 *
 * Dismissal is remembered per message (keyed by a hash of the text), so someone
 * who closes today's note still sees tomorrow's.
 */
export function AnnouncementBar({ text }: { text: string | null }) {
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    if (!text) return
    try {
      setDismissed(window.localStorage.getItem(`sweetg:note:${hash(text)}`) === '1')
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
    <div className="bg-primary text-primary-foreground">
      <div className="wrap flex items-center gap-3 py-1.5">
        <p className="flex-1 truncate font-mono text-[10px] uppercase tracking-[0.12em] sm:text-[11px]">
          {text}
        </p>
        <button
          onClick={close}
          aria-label="Dismiss announcement"
          className="-mr-1 shrink-0 px-2 py-1 font-mono text-[13px] leading-none opacity-70 transition-opacity hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

/** Tiny non-cryptographic hash — only needs to tell one note from another. */
function hash(s: string): string {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return Math.abs(h).toString(36)
}
