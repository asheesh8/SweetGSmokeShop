import Image from 'next/image'

/**
 * The shop's real crest, as used on their storefront and their existing site.
 *
 * This is their identity — green, chartreuse and red, "ESTD 2018", the monkey
 * mascot — so it leads, and the rest of the system is tuned around it rather
 * than competing with it. The wordmark beside it is set in the site's display
 * face so the lockup still belongs to this design.
 *
 * `priority` because it sits in the fixed nav and is visible at first paint on
 * every route; lazy-loading it would pop in after the hero.
 */
export function Wordmark({
  className,
  size = 30,
  showText = true,
  dim,
}: {
  className?: string
  size?: number
  showText?: boolean
  /** Override for the subline when the lockup sits over photography. */
  dim?: string
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ''}`}>
      <Image
        src="/brand/logo.png"
        alt="Sweet G's Smoke Shop"
        width={size}
        height={Math.round(size * 0.748)}
        priority
        className="h-auto w-auto shrink-0"
        style={{ width: size, height: 'auto' }}
      />
      {showText && (
        <span className="flex flex-col leading-none">
          <span className="display whitespace-nowrap text-[14px] tracking-[0.02em] sm:text-[15px]">
            SWEET G&rsquo;S
          </span>
          <span
            className="mt-[3px] hidden whitespace-nowrap font-mono text-[8px] tracking-[0.24em] text-muted-foreground xs:block"
            style={dim ? { color: dim } : undefined}
          >
            SMOKE SHOP
          </span>
        </span>
      )}
    </span>
  )
}
