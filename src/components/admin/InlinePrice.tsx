'use client'

import { useRef } from 'react'
import { Input } from '@/components/ui/input'

/**
 * Price cell that saves on blur or Enter.
 *
 * A bare form with one input already submits on Enter, but a shop owner
 * updating a column of prices tabs between them and never presses it — so blur
 * has to commit too, or their edits silently vanish. Only submits when the
 * value actually changed, to avoid a write per tab-through.
 */
export function InlinePrice({
  id,
  cents,
  label,
  action,
}: {
  id: string
  cents: number | null
  label: string
  action: (formData: FormData) => void
}) {
  const initial = cents != null ? (cents / 100).toFixed(2) : ''
  const formRef = useRef<HTMLFormElement>(null)
  const last = useRef(initial)

  const commit = (value: string) => {
    if (value.trim() === last.current.trim()) return
    last.current = value
    formRef.current?.requestSubmit()
  }

  return (
    <form ref={formRef} action={action} className="flex items-center">
      <input type="hidden" name="id" value={id} />
      <Input
        name="price"
        defaultValue={initial}
        placeholder="—"
        inputMode="decimal"
        aria-label={`Price for ${label}`}
        className="h-9 w-24 text-center font-mono text-[12px]"
        onBlur={(e) => commit(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            e.currentTarget.blur()
          }
        }}
      />
    </form>
  )
}
