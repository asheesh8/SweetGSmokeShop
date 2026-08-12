'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { SHOP, DIRECTIONS_URL } from '@/lib/shop'

type Ch = {
  id: string
  label: string
  img: string
  kind: 'title' | 'statement' | 'card'
  line1?: string
  line2?: string
  sub?: string
  /** Which side the type sits on, so it lands in the frame's empty space. */
  side?: 'left' | 'center' | 'right'
}

const CHAPTERS: Ch[] = [
  {
    id: 'flower',
    label: 'The Flower',
    img: '/img/ch01-flower.jpg',
    kind: 'title',
    sub: 'Not your average smoke shop.',
    side: 'left',
  },
  {
    id: 'grind',
    label: 'The Grind',
    img: '/img/ch02-grind.jpg',
    kind: 'statement',
    line1: 'Even grind.',
    line2: 'Even burn.',
    side: 'right',
  },
  {
    id: 'pack',
    label: 'The Pack',
    img: '/img/ch03-pack.jpg',
    kind: 'statement',
    line1: 'Good glass',
    line2: 'earns its money.',
    side: 'left',
  },
  {
    id: 'light',
    label: 'The Light',
    img: '/img/ch04-light.jpg',
    kind: 'statement',
    line1: 'Slow pull.',
    line2: 'Clean water.',
    side: 'center',
  },
  {
    id: 'shop',
    label: 'The Shop',
    img: '/img/ch05-glass.jpg',
    kind: 'card',
    line1: 'Come get set up.',
    sub: `Glass, vapes, CBD, art and clothing. ${SHOP.address.street}, South Burlington — ${yearsLabel()} years in the same spot.`,
    side: 'center',
  },
]

function yearsLabel() {
  return new Date().getFullYear() - SHOP.established
}

/**
 * The chapter film.
 *
 * One fixed backdrop that crossfades between frames while the chapters scroll
 * over it — that's what makes it feel continuous rather than like five stacked
 * hero sections. Scroll itself is completely native: no pinning, no hijacking,
 * no smoothing library. You can flick past the whole thing in one gesture.
 *
 * The backdrop is always dark regardless of theme. These are photographs, and
 * cinema doesn't have a light mode — the rest of the page follows the theme.
 */
export function Film() {
  const [active, setActive] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const layerRefs = useRef<(HTMLDivElement | null)[]>([])

  // Which chapter owns the viewport right now.
  useEffect(() => {
    const sections = wrapRef.current?.querySelectorAll('[data-chapter]')
    if (!sections?.length) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.chapter)
            setActive(i)
          }
        }
      },
      // A tall, narrow band across the middle: whichever chapter crosses the
      // centre line is the one being read.
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  // Slow parallax drift on the live frame. Driven straight from scrollY in a
  // rAF — putting scroll position into React state would re-render the whole
  // film every frame for a transform we can write directly.
  useEffect(() => {
    let raf = 0
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        for (const el of layerRefs.current) {
          if (el) el.style.transform = `scale(1.08) translate3d(0, ${(y % 900) * 0.035}px, 0)`
        }
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={wrapRef} className="relative">
      {/* ── Fixed backdrop ─────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[#0b0a09]">
        {CHAPTERS.map((c, i) => (
          <div
            key={c.id}
            ref={(el) => {
              layerRefs.current[i] = el
            }}
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1100ms] ease-out will-change-[opacity,transform]"
            style={{
              backgroundImage: `url(${c.img})`,
              opacity: i === active ? 1 : 0,
            }}
          />
        ))}
        {/* Legibility scrim — fixed dark values, not theme tokens, because it
            sits over photography in both themes. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,7,6,0.92),rgba(8,7,6,0.15)_45%,rgba(8,7,6,0.6))]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_35%,rgba(8,7,6,0.7)_100%)]" />
      </div>

      {/* Chapter marker. Lives here rather than in the nav — navigation
          links matter more than a cinematic readout, and on a phone there is
          no room for both. */}
      <div className="pointer-events-none fixed bottom-5 left-0 right-0 z-20 md:bottom-7">
        <div className="wrap flex items-center gap-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#f4efe4]/60 md:text-[10px]">
            Ch {String(active + 1).padStart(2, '0')} &mdash; {CHAPTERS[active].label}
          </span>
          <span className="h-px flex-1 max-w-24 bg-[#f4efe4]/20" aria-hidden="true">
            <span
              className="block h-px bg-[#f4efe4]/70 transition-[width] duration-500"
              style={{ width: `${((active + 1) / CHAPTERS.length) * 100}%` }}
            />
          </span>
        </div>
      </div>

      {/* ── Chapters ───────────────────────────────────────── */}
      <div className="relative z-10">
        {CHAPTERS.map((c, i) => (
          <section
            key={c.id}
            data-chapter={i}
            id={`ch-${c.id}`}
            aria-label={`Chapter ${i + 1} — ${c.label}`}
            className={`flex min-h-[100svh] flex-col justify-center px-5 md:px-14 ${
              c.side === 'center'
                ? 'items-start text-left md:items-center md:text-center'
                : c.side === 'right'
                  ? 'items-start text-left md:items-end md:text-right'
                  : 'items-start text-left'
            }`}
          >
            {c.kind === 'title' && (
              <div className="w-full max-w-6xl">
                <h1 className="display text-[clamp(3rem,15vw,15rem)] leading-[0.84] text-[#f4efe4] drop-shadow-[0_4px_40px_rgba(0,0,0,0.6)]">
                  Sweet G&rsquo;s
                </h1>
                <p className="mt-6 max-w-md text-lg text-[#f4efe4]/80 md:text-xl">{c.sub}</p>
                <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                  <Button asChild size="lg">
                    <Link href="/shop">Browse the shop</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-[#f4efe4]/40 bg-transparent text-[#f4efe4] hover:bg-[#f4efe4]/10 hover:text-[#f4efe4]"
                  >
                    <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer">
                      {SHOP.address.street} &rarr;
                    </a>
                  </Button>
                </div>
              </div>
            )}

            {c.kind === 'statement' && (
              <h2 className="display max-w-4xl text-[clamp(2.1rem,8vw,6rem)] leading-[0.94] text-[#f4efe4] drop-shadow-[0_4px_40px_rgba(0,0,0,0.65)]">
                {c.line1}
                <br />
                {c.line2}
              </h2>
            )}

            {c.kind === 'card' && (
              <div className="w-full max-w-lg rounded-[var(--radius-lg)] border border-[#f4efe4]/15 bg-[rgba(18,15,12,0.78)] p-7 backdrop-blur-md md:p-11">
                <h2 className="display text-[clamp(2rem,5vw,3.2rem)] text-[#f4efe4]">{c.line1}</h2>
                <p className="mt-4 text-[15px] leading-relaxed text-[#f4efe4]/70">{c.sub}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button asChild size="lg">
                    <Link href="/shop">Find your gear</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-[#f4efe4]/40 bg-transparent text-[#f4efe4] hover:bg-[#f4efe4]/10 hover:text-[#f4efe4]"
                  >
                    <a href={SHOP.phoneHref}>{SHOP.phone}</a>
                  </Button>
                </div>
              </div>
            )}

            {i === 0 && (
              <p className="absolute bottom-16 right-5 font-mono text-[9px] uppercase tracking-[0.4em] text-[#f4efe4]/45 md:bottom-7 md:right-14">
                Scroll
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
