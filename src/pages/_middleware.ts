// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'

import { validateAuth } from 'utils/auth'

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.includes('/api/')) {
    return
  }
  const token = validateAuth(req)
  if (req.nextUrl.pathname === '/login') {
    if (!token) {
      return
    }
    return NextResponse.rewrite(new URL('/', req.url))
  }
  if (!token) {
    return NextResponse.rewrite(new URL('/login', req.url))
  }
}
