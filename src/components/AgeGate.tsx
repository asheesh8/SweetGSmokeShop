'use client'

import { useEffect, useState } from 'react'
import { SHOP } from '@/lib/shop'
import { Cinematic } from '@/components/Cinematic'
import { Wordmark } from '@/components/Wordmark'

const KEY = 'gma:age-ok'

/**
 * 21+ gate.
 *
 * Legally required for this category and the first thing anyone sees, so it
 * gets the same treatment as the hero rather than being a grey modal.
 * Verification is self-attestation persisted to localStorage — the norm for
 * tobacco retail, and all a static site can honestly claim to do.
 */
export function AgeGate() {
  // `null` = still reading storage. Rendering nothing until we know avoids
  // flashing the gate at someone who already passed it.
  const [ok, setOk] = useState<boolean | null>(null)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    let passed = false
    try {
      passed = window.localStorage.getItem(KEY) === '1'
    } catch {
      // Private mode / storage blocked — gate every visit rather than fail open.
    }
    setOk(passed)
    if (!passed) document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const accept = () => {
    try {
      window.localStorage.setItem(KEY, '1')
    } catch {
      /* non-fatal: they'll see the gate again next visit */
    }
    setLeaving(true)
    document.body.style.overflow = ''
    window.setTimeout(() => setOk(true), 520)
  }

  if (ok === null || ok === true) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-[90] grid place-items-center overflow-hidden bg-background px-6 transition-opacity duration-500"
      style={{ opacity: leaving ? 0 : 1, pointerEvents: leaving ? 'none' : 'auto' }}
    >
      <Cinematic src="/video/smoke-loop.mp4" poster="/video/smoke-loop.jpg" scrim="soft" rate={0.6} />

      <div className="relative w-full max-w-md text-center">
        <Wordmark className="justify-center" />

        <h1 id="age-gate-title" className="display mt-10 text-[clamp(2.2rem,7vw,3.2rem)] text-foreground">
          Are you {SHOP.minimumAge} or older?
        </h1>

        <p className="mx-auto mt-5 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
          You must be {SHOP.minimumAge}+ to enter {SHOP.name}. Tobacco products are not
          for sale to minors.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={accept}
            className="border border-primary bg-primary px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-85"
          >
            Yes, I&rsquo;m {SHOP.minimumAge}+
          </button>
          <a
            href="https://www.google.com"
            className="border border-border px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:border-border hover:text-foreground"
          >
            No, take me out
          </a>
        </div>

        <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {SHOP.address.street} &middot; {SHOP.address.locality}, {SHOP.address.region}
        </p>
      </div>
    </div>
  )
}
