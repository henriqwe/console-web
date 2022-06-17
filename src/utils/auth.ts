type Request = { cookies?: any }
import jwt, { JwtPayload } from 'jsonwebtoken'

export function validateAuth(req: Request) {
  if (!req.cookies?.access_token) {
    return false
  }

  const key = `-----BEGIN PUBLIC KEY-----\n${process.env.JWT_TOKEN}\n-----END PUBLIC KEY-----`

  return req.cookies?.access_token
  // const payloadOrFalse = verifyToken(req.cookies?.access_token, key)
  // return payloadOrFalse
  //   ? ({ token: req.cookies?.access_token, payload: payloadOrFalse } as any)
  //   : payloadOrFalse
}

// export function verifyToken(token: string, key: string): JwtPayload | false {
//   try {
//     return jwt.verify(token, key, { ignoreExpiration: false }) as JwtPayload
//   } catch (e) {
//     console.error(e, token, key)
//     return false
//   }
// }
