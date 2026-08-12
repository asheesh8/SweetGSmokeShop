'use client'

import { useEffect, useState } from 'react'

/**
 * Product tile imagery, with a deliberate fallback.
 *
 * `src` may be a Supabase Storage URL, a bundled `/products/<slug>.jpg`, or
 * nothing at all. When it's missing or fails to load, this renders a
 * palette-graded catalogue plate rather than a broken image or a grey box — a
 * shop mid-way through photographing its stock should still look finished.
 */
export function ProductImage({
  src,
  name,
  category,
  index,
  className = '',
}: {
  src: string | null
  name: string
  category: string
  index: number
  className?: string
}) {
  const [failed, setFailed] = useState(!src)

  // A new src (switching products in the quick view) deserves a fresh attempt.
  useEffect(() => setFailed(!src), [src])

  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- src is a runtime value from Supabase Storage
      <img
        src={src}
        alt={name}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }

  return (
    <div className={`plate relative grid h-full w-full place-items-center overflow-hidden ${className}`}>
      <span
        className="display pointer-events-none absolute -bottom-6 -right-2 text-[7rem] leading-none text-foreground/[0.07]"
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="eyebrow relative z-10 px-4 text-center">{category}</span>
    </div>
  )
}
