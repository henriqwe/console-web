import cookie from 'cookie'
import Cookies from 'js-cookie'

export function parseCookies(req?: any) {
  if (!req || !req.cookies) {
    return {}
  }

  return cookie.parse(req.cookies.kcToken || '')
}

export function setCookie(
  key: string,
  value: any,
  options?: Cookies.CookieAttributes
) {
  Cookies.set(key, value, {
    ...options,
    secure: process.env.NODE_ENV === 'production' ? true : false
  })
}

export function getCookie(key: string) {
  return Cookies.get(key)
}
