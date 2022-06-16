// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'

import { validateAuth } from 'utils/auth'

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === '/login') {
    return
  }
  const token = validateAuth(req)
  if (!token) {
    return NextResponse.redirect('/login')
  }
}
