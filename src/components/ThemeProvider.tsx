'use client'

import { ThemeProvider as NextThemes } from 'next-themes'

/**
 * Dark is the default here rather than following the OS.
 *
 * The two themes aren't light/dark variants of one design — they're two
 * personalities, and Nocturne is the one the brand leads with. Someone who
 * wants the hippie side chooses it; we don't hand it to them because their
 * laptop is in light mode.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange={false}>
      {children}
    </NextThemes>
  )
}
