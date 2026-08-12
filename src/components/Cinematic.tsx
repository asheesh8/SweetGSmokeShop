'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Full-bleed background footage.
 *
 * Every clip is optional. Until the Seedance file exists in public/video, this
 * renders the `.plate` gradient — graded to the same palette the footage will
 * have — so the site looks finished at every stage rather than showing holes.
 * That's the difference between "not done yet" and "broken".
 *
 * Autoplay rules that actually matter: muted + playsInline or iOS refuses, and
 * the source must carry no audio track at all (see the -an flag in the shot
 * list) because Safari will still block a muted video that has silent audio.
 */
export function Cinematic({
  src,
  poster,
  className = '',
  scrim = 'full',
  /** Slows playback; background footage reads better under real time. */
  rate = 0.85,
  priority = false,
}: {
  src?: string
  poster?: string
  className?: string
  scrim?: 'full' | 'soft' | 'none'
  rate?: number
  priority?: boolean
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(!src)

  useEffect(() => {
    const v = ref.current
    if (!v) return

    // The <video> is server-rendered, so a missing file errors during the
    // initial load — before React hydrates and attaches onError. The prop
    // alone silently misses it and we'd sit on a black box forever. Check the
    // element's own state on mount as well.
    // networkState 3 === NETWORK_NO_SOURCE.
    if (v.error || v.networkState === 3) {
      setFailed(true)
      return
    }

    v.playbackRate = rate

    // See RitualDemo: React never writes the `muted` attribute, only the
    // property, and Safari checks the attribute before permitting autoplay.
    v.setAttribute('muted', '')

    // Don't burn decode budget on footage that's scrolled off screen.
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.01 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [rate, src])

  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Reduced motion: hold a single frame rather than loop.
    ref.current?.pause()
  }, [])

  return (
    <div className={`absolute inset-0 overflow-hidden ${failed ? 'plate' : 'bg-background'} ${className}`}>
      {src && !failed && (
        <video
          ref={ref}
          className="h-full w-full object-cover"
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay
          preload={priority ? 'auto' : 'metadata'}
          onError={() => setFailed(true)}
          aria-hidden="true"
        />
      )}
      {/* The scrim exists to make bright footage safe to set type on. With no
          footage it has nothing to knock back, and at full strength it crushed
          the fallback plate to flat black — so it's dialled down until a clip
          actually loads. */}
      {scrim !== 'none' && (
        <div
          className={scrim === 'full' ? 'scrim' : 'scrim-soft'}
          style={failed ? { opacity: 0.35 } : undefined}
        />
      )}
    </div>
  )
}
