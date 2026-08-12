import type { Metadata } from 'next'
import Link from 'next/link'
import { getStaffUser } from '@/lib/supabase/server'
import { supabaseConfigured } from '@/lib/supabase/config'
import { signOut } from './actions'
import { Button } from '@/components/ui/button'
import { SetupNotice } from '@/components/admin/SetupNotice'

export const metadata: Metadata = {
  title: 'Shop admin',
  // Never let the back office into an index.
  robots: { index: false, follow: false },
}

const NAV = [
  { href: '/admin', label: 'Today' },
  { href: '/admin/products', label: 'Inventory' },
  { href: '/admin/categories', label: 'Categories' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!supabaseConfigured) {
    return (
      <div className="min-h-screen bg-background px-6 py-16">
        <SetupNotice />
      </div>
    )
  }

  const staff = await getStaffUser()

  // The login page renders inside this layout but before there's a user.
  if (!staff) return <div className="min-h-screen bg-background">{children}</div>

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-5">
          <div className="flex items-center gap-7">
            <Link href="/admin" className="display text-base">
              SWEET G&rsquo;S ADMIN
            </Link>
            <nav className="hidden items-center gap-6 sm:flex" aria-label="Admin">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-primary md:block"
            >
              View site ↗
            </Link>
            <span className="hidden font-mono text-[10px] text-muted-foreground lg:block">
              {staff.name || staff.email}
            </span>
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>

        <nav className="flex gap-5 border-t border-border px-5 py-2 sm:hidden" aria-label="Admin">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  )
}
