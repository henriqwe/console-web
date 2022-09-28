import { NextRequest, NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

const whitelist = ['/api/', '/assets/']
const secret = process.env.NEXTAUTH_SECRET

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  for (const path of whitelist) {
    if (pathname.includes(path)) {
      return
    }
  }
  const token = await getToken({ req, secret })

  if (pathname === '/login') {
    if (!token) {
      return
    }
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (pathname === '/register') {
    return
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  return
}
