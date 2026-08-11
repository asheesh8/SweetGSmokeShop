'use client'

import { useState } from 'react'

/**
 * Product tile imagery.
 *
 * Sweet G's has no product photography yet, and a store grid with no pictures
 * is the thing that makes a shop look unfinished. So the fallback is a
 * deliberate editorial plate — palette-graded, with the index numeral and
 * category set like a catalogue plate — rather than a grey box or a stock
 * photo that isn't theirs.
 *
 * Drop a real photo at `public/products/<slug>.jpg` and it takes over with no
 * code change.
 */
export function ProductImage({
  slug,
  name,
  category,
  index,
  className = '',
}: {
  slug: string
  name: string
  category: string
  index: number
  className?: string
}) {
  const [failed, setFailed] = useState(false)

  if (!failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- unknown-at-build-time
      <img
        src={`/products/${slug}.jpg`}
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
