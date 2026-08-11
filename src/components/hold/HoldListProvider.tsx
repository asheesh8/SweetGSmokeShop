'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type HoldItem = { slug: string; name: string; category: string; note?: string }

type Ctx = {
  items: HoldItem[]
  add: (item: HoldItem) => void
  remove: (slug: string) => void
  clear: () => void
  has: (slug: string) => boolean
  open: boolean
  setOpen: (v: boolean) => void
}

const HoldCtx = createContext<Ctx | null>(null)
const KEY = 'sweetg:hold-list'

/**
 * The hold list — this shop's version of a cart.
 *
 * It collects items and sends one enquiry so the shop can put them behind the
 * counter. It deliberately never touches payment: Stripe and PayPal both
 * prohibit tobacco and smoking accessories, so a real checkout here would be a
 * compliance problem, not a feature. Everything else about it behaves like a
 * cart — persistence, a badge count, a slide-out — because that's the
 * interaction people already know.
 */
export function HoldListProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<HoldItem[]>([])
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // Read once on mount rather than lazily in useState: localStorage isn't
  // available during SSR, and seeding state from it would hydrate-mismatch.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {
      /* corrupt or blocked storage — start empty rather than crash */
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      window.localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      /* private mode — the list just won't survive a reload */
    }
  }, [items, loaded])

  const add = useCallback((item: HoldItem) => {
    setItems((prev) => (prev.some((p) => p.slug === item.slug) ? prev : [...prev, item]))
  }, [])

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((p) => p.slug !== slug))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<Ctx>(
    () => ({
      items,
      add,
      remove,
      clear,
      has: (slug) => items.some((i) => i.slug === slug),
      open,
      setOpen,
    }),
    [items, add, remove, clear, open],
  )

  return <HoldCtx.Provider value={value}>{children}</HoldCtx.Provider>
}

export function useHoldList(): Ctx {
  const ctx = useContext(HoldCtx)
  if (!ctx) throw new Error('useHoldList must be used inside <HoldListProvider>')
  return ctx
}
