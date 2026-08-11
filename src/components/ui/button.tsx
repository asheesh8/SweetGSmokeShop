import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Adapted from the registry default in two ways:
 *
 * 1. `asChild` is supported. This registry ships the Base UI button, which
 *    composes via a `render` prop rather than Radix's `asChild`. Accepting
 *    `asChild` and forwarding it to `render` keeps every call site written the
 *    way the rest of the ecosystem is written.
 * 2. Sizes are larger and labels are mono uppercase. The stock scale tops out
 *    at h-9, which reads as an admin dashboard next to full-bleed photography.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] border border-transparent font-mono text-[11px] uppercase tracking-[0.14em] transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-85",
        outline: "border-border bg-transparent hover:border-primary hover:text-primary",
        secondary: "bg-secondary text-secondary-foreground hover:opacity-85",
        ghost: "hover:text-primary",
        destructive: "bg-destructive text-primary-foreground hover:opacity-85",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-[10px]",
        default: "h-10 px-5",
        lg: "h-12 px-7",
        icon: "size-10 px-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    /** Render as the single child element (a Link, an anchor) instead of a <button>. */
    asChild?: boolean
  }

function Button({ className, variant, size, asChild, children, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, className }))

  if (asChild && React.isValidElement(children)) {
    return (
      <ButtonPrimitive
        data-slot="button"
        className={classes}
        // Base UI assumes a native <button> and warns that rendering anything
        // else silently drops button semantics. When we compose onto a Link or
        // an anchor that's intentional — the element already has its own role
        // and keyboard behaviour — so we tell it so rather than muting a real
        // accessibility warning.
        nativeButton={false}
        render={children as React.ReactElement<Record<string, unknown>>}
        {...props}
      />
    )
  }

  return (
    <ButtonPrimitive data-slot="button" className={classes} {...props}>
      {children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
