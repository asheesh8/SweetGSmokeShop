'use client'

import { useEffect, useState } from 'react'
import { openState } from '@/lib/shop'

/**
 * "Open now" indicator.
 *
 * Renders nothing on the server on purpose: the server's clock isn't the
 * shop's local time, so a server-rendered answer would be wrong for some
 * visitors and hydrate-mismatch for the rest. Client-only is the right trade
 * for a fact that is definitionally about the viewer's "now".
 */
export function OpenBadge({ className = '' }: { className?: string }) {
  const [state, setState] = useState<ReturnType<typeof openState> | null>(null)

  useEffect(() => {
    const update = () => setState(openState(new Date()))
    update()
    const id = window.setInterval(update, 60_000)
    return () => window.clearInterval(id)
  }, [])

  if (!state) return null

  return (
    <span
      className={`inline-flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
        {state.open && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-herb opacity-60" />
        )}
        <span
          className="relative inline-flex h-1.5 w-1.5 rounded-full"
          style={{ background: state.open ? 'var(--color-herb)' : 'var(--color-rust)' }}
        />
      </span>
      {state.open ? `Open now · till ${state.until}` : `Closed · opens ${state.next}`}
    </span>
  )
}
