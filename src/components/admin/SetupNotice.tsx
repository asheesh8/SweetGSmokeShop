/**
 * Shown at /admin when Supabase isn't attached yet.
 *
 * The alternative — redirecting to a login that cannot possibly succeed — is
 * the kind of dead end that costs someone twenty minutes. This states exactly
 * what's missing and what to do about it.
 */
export function SetupNotice() {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="eyebrow eyebrow-rule">Setup</p>
      <h1 className="display mt-5 text-3xl">Connect Supabase to switch this on</h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        The storefront is running on its built-in catalogue right now, so nothing is broken —
        but inventory can&rsquo;t be edited until there&rsquo;s a database behind it. Three steps:
      </p>

      <ol className="mt-8 space-y-6">
        <li className="border border-border bg-card p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">Step 1</p>
          <p className="mt-2 font-medium">Run the schema</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            In your Supabase project: <strong>SQL Editor → New query</strong>, paste the whole of{' '}
            <code className="font-mono text-[12px] text-primary">supabase/schema.sql</code> from
            this repo, and run it. It creates the tables, the security policies and the image
            bucket, and seeds the six categories.
          </p>
        </li>

        <li className="border border-border bg-card p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">Step 2</p>
          <p className="mt-2 font-medium">Add the keys</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Copy them from <strong>Project Settings → API</strong> into{' '}
            <code className="font-mono text-[12px]">.env.local</code>, then restart the dev server:
          </p>
          <pre className="scroll-x mt-3 border border-border bg-background p-3 font-mono text-[11px] leading-relaxed">
{`NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...`}
          </pre>
          <p className="mt-2 text-xs text-muted-foreground">
            Both are publishable keys — safe in the browser. Row Level Security is what protects
            the data, which is why the schema in step 1 isn&rsquo;t optional.
          </p>
        </li>

        <li className="border border-border bg-card p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">Step 3</p>
          <p className="mt-2 font-medium">Make yourself staff</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Create your user under <strong>Authentication → Users → Add user</strong> (set a
            password and tick <em>Auto Confirm User</em>), then run this so that account is allowed
            to edit anything:
          </p>
          <pre className="scroll-x mt-3 border border-border bg-background p-3 font-mono text-[11px]">
{`insert into staff (email, name)
values ('sweetgsmokeshop@gmail.com', 'Jordan');`}
          </pre>
          <p className="mt-2 text-xs text-muted-foreground">
            Having an account isn&rsquo;t enough on its own — only emails in this table can write.
          </p>
        </li>
      </ol>

      <p className="mt-8 text-sm text-muted-foreground">
        Reload this page once those are done and you&rsquo;ll get the login screen.
      </p>
    </div>
  )
}
