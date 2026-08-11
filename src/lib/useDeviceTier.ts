'use client'

import { useEffect, useState } from 'react'

export type Tier = 'high' | 'low' | 'static'

/**
 * Decides how much scene to render.
 *
 *   high   — full particle counts, bloom on
 *   low    — reduced counts, bloom off, DPR clamped (phones, weak GPUs)
 *   static — no animation at all; the journey renders as poster frames
 *
 * Resolved on the client only. It starts as `null` so the first paint is
 * identical on server and client, then settles — that avoids a hydration
 * mismatch and stops us rendering a heavy scene we're about to throw away.
 */
export function useDeviceTier(): Tier | null {
  const [tier, setTier] = useState<Tier | null>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')

    const resolve = () => {
      if (reduce.matches) return setTier('static')

      const coarse = window.matchMedia('(pointer: coarse)').matches
      const narrow = window.innerWidth < 900
      const cores = navigator.hardwareConcurrency ?? 4
      // Chromium-only, absent elsewhere — treated as "unknown, assume fine".
      const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8

      setTier(coarse || narrow || cores <= 4 || mem <= 4 ? 'low' : 'high')
    }

    resolve()
    reduce.addEventListener('change', resolve)
    window.addEventListener('resize', resolve, { passive: true })
    return () => {
      reduce.removeEventListener('change', resolve)
      window.removeEventListener('resize', resolve)
    }
  }, [])

  return tier
}

/** Per-tier scene budget. One place to turn the whole site up or down. */
export const BUDGET = {
  high: { chunks: 900, smoke: 120, dpr: [1, 2] as [number, number], bloom: true, shadows: true },
  low: { chunks: 260, smoke: 42, dpr: [1, 1.4] as [number, number], bloom: false, shadows: false },
  static: { chunks: 0, smoke: 0, dpr: [1, 1] as [number, number], bloom: false, shadows: false },
} as const
