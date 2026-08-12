'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

/**
 * Nocturne ↔ Hippie.
 *
 * Labelled by what it switches to rather than with a bare icon, because the
 * two themes are different personalities and the icon alone undersells that.
 * Renders a fixed-size placeholder before mount — the resolved theme is only
 * known on the client, and swapping the glyph after hydration would shift the
 * nav.
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={mounted ? `Switch to ${isDark ? 'hippie' : 'nocturne'} theme` : 'Switch theme'}
      title={mounted ? (isDark ? 'Hippie mode' : 'Nocturne mode') : undefined}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-[var(--radius-sm)] border transition-colors hover:border-primary hover:text-primary ${className || 'border-border text-muted-foreground'}`}
    >
      {!mounted ? (
        <span className="block h-4 w-4" />
      ) : isDark ? (
        // Sun — the hippie side you'd be switching to.
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
          </g>
        </svg>
      ) : (
        // Moon — back to nocturne.
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.5 8.5 0 1 0 10.2 10.2Z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  )
}
