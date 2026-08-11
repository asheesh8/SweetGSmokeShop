'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SHOP } from '@/lib/shop'
import { Wordmark } from '@/components/Wordmark'
import { ThemeToggle } from '@/components/ThemeToggle'
import { HoldSheet } from '@/components/hold/HoldSheet'
import { useHoldList } from '@/components/hold/HoldListProvider'
import { useChapter } from '@/components/film/ChapterContext'

const LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/#ritual', label: 'The Ritual' },
  { href: '/#story', label: 'About' },
  { href: '/visit', label: 'Visit' },
]

export function Nav() {
  const [solid, setSolid] = useState(false)
  const [menu, setMenu] = useState(false)
  const { items, setOpen } = useHoldList()
  const { chapter } = useChapter()

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          solid ? 'border-b border-border bg-background/85 backdrop-blur-xl' : 'border-b border-transparent'
        }`}
      >
        <nav className="wrap flex h-16 items-center justify-between gap-6" aria-label="Main">
          <Link href="/" aria-label={`${SHOP.name} — home`}>
            <Wordmark />
          </Link>

          {/* On the film, the centre of the nav becomes the chapter readout —
              the same slot the links occupy everywhere else. */}
          {chapter ? (
            <div className="hidden flex-col items-center gap-1.5 md:flex">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/70">
                Ch {String(chapter.index).padStart(2, '0')} &mdash; {chapter.label}
              </span>
              <span className="h-px w-28 bg-foreground/20" aria-hidden="true">
                <span
                  className="block h-px bg-foreground/80 transition-[width] duration-500"
                  style={{ width: `${(chapter.index / chapter.total) * 100}%` }}
                />
              </span>
            </div>
          ) : (
            <ul className="hidden items-center gap-9 md:flex">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center gap-2">
            <a
              href={SHOP.phoneHref}
              className="hidden rounded-[var(--radius-sm)] border border-border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors hover:border-primary hover:text-primary lg:block"
            >
              {SHOP.phone}
            </a>

            <ThemeToggle />

            <button
              onClick={() => setOpen(true)}
              className="relative flex h-9 items-center gap-2 rounded-[var(--radius-sm)] border border-border px-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors hover:border-primary hover:text-primary"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="hidden sm:inline">Hold</span>
              {items.length > 0 && (
                <span className="grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] tabular-nums text-primary-foreground">
                  {items.length}
                </span>
              )}
              <span className="sr-only">
                {items.length} item{items.length === 1 ? '' : 's'} on your hold list
              </span>
            </button>

            <button
              onClick={() => setMenu((v) => !v)}
              aria-expanded={menu}
              aria-controls="mobile-menu"
              className="grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] border border-border md:hidden"
            >
              <span className="sr-only">{menu ? 'Close menu' : 'Open menu'}</span>
              <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true">
                <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                  {menu ? (
                    <>
                      <path d="M2 2 L14 10" />
                      <path d="M14 2 L2 10" />
                    </>
                  ) : (
                    <>
                      <path d="M1 2 h14" />
                      <path d="M1 6 h14" />
                      <path d="M1 10 h14" />
                    </>
                  )}
                </g>
              </svg>
            </button>
          </div>
        </nav>

        {menu && (
          <div id="mobile-menu" className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
            <ul className="wrap flex flex-col py-4">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setMenu(false)}
                    className="display block py-3 text-2xl"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="pt-3">
                <a
                  href={SHOP.phoneHref}
                  className="block rounded-[var(--radius-sm)] border border-border px-4 py-3 text-center font-mono text-[11px] uppercase tracking-[0.14em]"
                >
                  Call {SHOP.phone}
                </a>
              </li>
            </ul>
          </div>
        )}
      </header>

      <HoldSheet />
    </>
  )
}
