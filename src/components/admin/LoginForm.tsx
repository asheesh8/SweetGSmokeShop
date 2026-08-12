'use client'

import { useActionState } from 'react'
import { signIn, type ActionResult } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Wordmark } from '@/components/Wordmark'

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(signIn, null)

  return (
    <form action={action} className="w-full max-w-sm">
      <Wordmark className="mb-8" />

      <h1 className="display text-3xl">Shop admin</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Staff only. This is where inventory, prices and the daily flavour list live.
      </p>

      <input type="hidden" name="next" value={next} />

      <div className="mt-8 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            autoFocus
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1.5"
          />
        </div>
      </div>

      {state && !state.ok && (
        <p
          role="alert"
          className="mt-5 border border-destructive bg-destructive/10 px-4 py-3 text-sm"
        >
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="mt-6 w-full">
        {pending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}
