// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'

import { validateAuth } from 'utils/auth'

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.includes('/api/')) {
    return
  }
  const token = validateAuth(req)
  console.log('token', token)
  if (req.nextUrl.pathname === '/login') {
    if (!token) {
      return
    }
    return NextResponse.redirect('http://localhost:3000/')
  }
  if (!token) {
    return NextResponse.redirect('http://localhost:3000/login')
  }
}
