import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigured } from '@/lib/supabase/config'

/**
 * Refreshes the Supabase session and gates /admin.
 *
 * Two things worth knowing:
 *
 * 1. `getUser()` is called, not `getSession()`. getSession reads the cookie
 *    without verifying it, so it can be forged; getUser round-trips to the auth
 *    server. For a gate, that difference is the whole point.
 * 2. This is a first line of defence, not the only one. Middleware can be
 *    bypassed in ways RLS cannot, so every write is *also* constrained by the
 *    `is_staff()` policies in the database.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const isAdmin = request.nextUrl.pathname.startsWith('/admin')
  const isLogin = request.nextUrl.pathname === '/admin/login'

  // With no database attached, let /admin render its own "connect Supabase"
  // instructions rather than redirecting into a login that cannot work.
  if (!supabaseConfigured) return response

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (isAdmin && !isLogin && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    // Bounce them back to what they were reaching for after signing in.
    url.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  if (isLogin && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    url.search = ''
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Everything except static assets and image files — the session cookie
     * needs refreshing on real navigations, not on every .jpg.
     */
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|glb|mp4)$).*)',
  ],
}
