// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'

import { validateAuth } from 'utils/auth'

const whitelist = ['/api/', '/assets/']

export function middleware(req: NextRequest) {
  for (const path of whitelist) {
    if (req.nextUrl.pathname.includes(path)) {
      return
    }
  }

  const token = validateAuth(req)
  if (req.nextUrl.pathname === '/login') {
    if (!token) {
      return
    }
    return NextResponse.redirect(new URL('/', req.url))
  }
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  return
}
