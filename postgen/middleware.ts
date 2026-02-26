import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow login page and API login route always
  if (pathname === '/login' || pathname === '/api/login') {
    return NextResponse.next()
  }

  // Check auth cookie
  const auth = req.cookies.get('postgen_auth')
  if (auth?.value === process.env.APP_PASSWORD) {
    return NextResponse.next()
  }

  // Redirect to login
  const loginUrl = req.nextUrl.clone()
  loginUrl.pathname = '/login'
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
