'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SHOP } from '@/lib/shop'
import { Wordmark } from '@/components/Wordmark'
import { ThemeToggle } from '@/components/ThemeToggle'
import { AnnouncementBar } from '@/components/AnnouncementBar'
import { HoldSheet } from '@/components/hold/HoldSheet'
import { useHoldList } from '@/components/hold/HoldListProvider'

const LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/#ritual', label: 'The Ritual' },
  { href: '/#story', label: 'About' },
  { href: '/visit', label: 'Visit' },
]

export function Nav({ announcement }: { announcement?: string | null }) {
  const [solid, setSolid] = useState(false)
  const [menu, setMenu] = useState(false)
  const { items, setOpen } = useHoldList()
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close on route change and on Escape. Without the pathname effect the
  // drawer stays open behind the page you just navigated to.
  useEffect(() => setMenu(false), [pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // The drawer covers the viewport; letting the page scroll underneath it is
  // the classic mobile-menu bug.
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menu])

  /*
   * Every page opens on dark photography, and the nav is transparent until you
   * scroll — so at the top it must be light-on-dark regardless of theme. In
   * hippie mode the themed foreground is dark brown, which disappeared against
   * the hero. Once the bar goes solid it follows the theme again.
   */
  const overHero = !solid && !menu
  const inkClass = overHero ? 'text-[#f4efe4]' : 'text-foreground'
  const dimClass = overHero ? 'text-[#f4efe4]/70' : 'text-muted-foreground'
  const edgeClass = overHero ? 'border-[#f4efe4]/30' : 'border-border'

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          solid || menu
            ? 'border-b border-border bg-background/90 backdrop-blur-xl'
            : 'border-b border-transparent'
        }`}
      >
        <AnnouncementBar text={announcement ?? null} />

        <nav className="wrap flex h-14 items-center justify-between gap-3 md:h-16" aria-label="Main">
          <Link href="/" aria-label={`${SHOP.name} — home`} className={`shrink-0 ${inkClass}`}>
            <Wordmark dim={overHero ? 'rgba(244,239,228,0.65)' : undefined} />
          </Link>

          {/* Real navigation, always. An earlier version replaced these with a
              chapter readout on the homepage, which looked cinematic and made
              the site harder to use. */}
          <ul className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`font-mono text-[11px] uppercase tracking-[0.16em] transition-colors hover:text-primary ${dimClass}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <a
              href={SHOP.phoneHref}
              className={`hidden rounded-[var(--radius-sm)] border px-3.5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors hover:border-primary hover:text-primary lg:block ${edgeClass} ${inkClass}`}
            >
              {SHOP.phone}
            </a>

            <ThemeToggle className={`${edgeClass} ${dimClass}`} />

            <button
              onClick={() => setOpen(true)}
              className={`relative flex h-9 items-center gap-2 rounded-[var(--radius-sm)] border px-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors hover:border-primary hover:text-primary sm:px-3 ${edgeClass} ${inkClass}`}
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
              className={`grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] border md:hidden ${edgeClass} ${inkClass}`}
            >
              <span className="sr-only">{menu ? 'Close menu' : 'Open menu'}</span>
              <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true">
                <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
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
      </header>

      {/* Full-height drawer. Sits below the header so the close button stays
          reachable, and scrolls internally on short screens. */}
      {menu && (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-14 z-40 overflow-y-auto overscroll-contain bg-background md:hidden"
        >
          <nav className="wrap flex flex-col py-6" aria-label="Mobile">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenu(false)}
                className="display border-b border-border py-5 text-3xl"
              >
                {l.label}
              </Link>
            ))}

            <a
              href={SHOP.phoneHref}
              className="mt-8 block rounded-[var(--radius-sm)] border border-primary bg-primary px-4 py-4 text-center font-mono text-[12px] uppercase tracking-[0.14em] text-primary-foreground"
            >
              Call {SHOP.phone}
            </a>

            <address className="mt-6 not-italic">
              <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-muted-foreground">
                {SHOP.address.street}, {SHOP.address.unit}
                <br />
                {SHOP.address.locality}, {SHOP.address.region} {SHOP.address.postalCode}
              </p>
            </address>

            <dl className="mt-5 space-y-1.5 pb-10">
              {SHOP.hours.map((h) => (
                <div key={h.days} className="flex justify-between gap-4 text-[13px]">
                  <dt className="text-muted-foreground">{h.days}</dt>
                  <dd className="font-mono tabular-nums">{h.label}</dd>
                </div>
              ))}
            </dl>
          </nav>
        </div>
      )}

      <HoldSheet />
    </>
  )
}
