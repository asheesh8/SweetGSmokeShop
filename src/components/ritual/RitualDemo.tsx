'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { SPECIMENS } from '@/lib/products'
import { SHOP } from '@/lib/shop'

// The viewer pulls in three + drei. Keeping it out of the initial bundle means
// the hero paints before any of that is even requested.
const NugViewer = dynamic(() => import('./NugViewer').then((m) => m.NugViewer), { ssr: false })

type Step =
  | { key: string; n: string; label: string; kind: '3d'; body: string }
  | { key: string; n: string; label: string; kind: 'video'; src: string; poster: string; body: string }

const STEPS: Step[] = [
  {
    key: 'flower',
    n: '01',
    label: 'The Flower',
    kind: '3d',
    body: 'A real nug, scanned in 3D — every pistil is geometry, not a photograph. Drag to turn it over.',
  },
  {
    key: 'grind',
    n: '02',
    label: 'The Grind',
    kind: 'video',
    src: '/video/grind.mp4',
    poster: '/video/grind.jpg',
    body: 'Even grind, even burn. The step everybody rushes, and the one that decides how the rest goes.',
  },
  {
    key: 'pack',
    n: '03',
    label: 'The Pack',
    kind: 'video',
    src: '/video/ritual-loop.mp4',
    poster: '/video/ritual-loop.jpg',
    body: 'Pack it like you mean it, but let it breathe. This is where good glass earns its money.',
  },
  {
    key: 'light',
    n: '04',
    label: 'The Light',
    kind: 'video',
    src: '/video/light.mp4',
    poster: '/video/light.jpg',
    body: 'Slow pull, clean water, good glass. Come get set up properly on Dorset Street.',
  },
]

/**
 * The ritual, as a compact demo rather than a page-length scroll.
 *
 * This replaced a 620vh pinned WebGL sequence. Same four beats, one stage, no
 * scroll hijacking — you can take the whole thing in without moving, and skip
 * it entirely by scrolling past like any other section.
 */
export function RitualDemo() {
  const [i, setI] = useState(0)
  const [spec, setSpec] = useState(0)
  const step = STEPS[i]
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoFailed, setVideoFailed] = useState(false)

  // Reset the failure flag when switching clips, or one missing file would
  // permanently show the fallback for every other step too.
  useEffect(() => setVideoFailed(false), [i])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.playbackRate = 0.85

    // React sets `muted` as a property and never writes the attribute, so the
    // server-rendered HTML arrives without it — and Safari reads the attribute
    // when deciding whether an autoplaying video is allowed to start. Setting
    // it explicitly is the difference between this playing on an iPhone and
    // sitting on a frozen first frame.
    v.setAttribute('muted', '')

    // Switching steps swaps the src; autoplay only fires reliably on first
    // mount, so ask for playback directly. Rejection is fine and expected
    // under strict autoplay policies — the poster stays up.
    void v.play().catch(() => {})
  }, [i])

  return (
    <section id="ritual" className="relative border-t border-border bg-card py-20 md:py-28">
      <div className="wrap grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* ── Copy ─────────────────────────────────────────── */}
        <div className="order-2 lg:order-1 lg:pt-6">
          <p className="eyebrow eyebrow-rule">The Ritual</p>
          <h2 className="display mt-5 text-[clamp(1.9rem,7vw,3.4rem)] text-foreground">
            Four steps.
            <br />
            We stock all of them.
          </h2>
          <p className="mt-6 max-w-sm leading-relaxed text-muted-foreground">
            Nobody here points at a shelf and walks away. Tell us how you actually
            use it and we&rsquo;ll set you up right — including talking you out of
            the expensive one when the cheap one is better.
          </p>

          <ol className="mt-9 space-y-1">
            {STEPS.map((s, idx) => {
              const on = idx === i
              return (
                <li key={s.key}>
                  <button
                    onClick={() => setI(idx)}
                    aria-current={on ? 'step' : undefined}
                    className={`group flex w-full items-baseline gap-4 border-l-2 py-3 pl-4 text-left transition-colors ${
                      on ? 'border-primary bg-card/[0.03]' : 'border-border hover:border-border'
                    }`}
                  >
                    <span className={`font-mono text-[11px] ${on ? 'text-primary' : 'text-muted-foreground'}`}>{s.n}</span>
                    <span className={`display text-lg ${on ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                      {s.label}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>

          <p key={step.key} className="mt-7 max-w-sm text-sm leading-relaxed text-muted-foreground rise">
            {step.body}
          </p>
        </div>

        {/* ── Stage ────────────────────────────────────────── */}
        <div className="relative order-1 lg:order-2">
          <div className="relative aspect-4/3 overflow-hidden border border-border plate">
            {step.kind === '3d' ? (
              <>
                <NugViewer url={SPECIMENS[spec].model} />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Drag to rotate &middot; scroll to zoom
                  </span>
                </div>
              </>
            ) : videoFailed ? (
              // Honest placeholder until the Seedance clip is generated.
              <div className="grid h-full place-items-center px-8 text-center">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Footage pending
                  </p>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {step.label} clip drops in at{' '}
                    <code className="font-mono text-[11px] text-primary">{step.src}</code>
                  </p>
                </div>
              </div>
            ) : (
              <video
                ref={videoRef}
                key={step.src}
                className="h-full w-full object-cover"
                src={step.src}
                poster={step.poster}
                muted
                loop
                playsInline
                autoPlay
                preload="metadata"
                onError={() => setVideoFailed(true)}
                aria-label={`${step.label} — ${step.body}`}
              />
            )}
          </div>

          {/* Specimen switch only means anything on the 3D step. */}
          {step.kind === '3d' && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {SPECIMENS.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setSpec(idx)}
                  aria-pressed={idx === spec}
                  className={`border px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                    idx === spec
                      ? 'border-primary text-primary'
                      : 'border-border text-muted-foreground hover:border-border hover:text-foreground'
                  }`}
                >
                  {s.name}
                </button>
              ))}
              <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Exhibit only &middot; not for sale
              </span>
            </div>
          )}

          {step.kind !== '3d' && (
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Everything in this step is on the shelf at {SHOP.address.street}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
