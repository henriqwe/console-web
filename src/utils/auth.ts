type Request = { cookies?: any }

export function validateAuth(req: Request) {
  if (!req.cookies.access_token) {
    return false
  }
  const token = Buffer.from(req.cookies.access_token, 'base64').toString('utf8')
  if (token !== undefined) {
    return true
  }
}
