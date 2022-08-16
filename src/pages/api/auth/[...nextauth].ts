import NextAuth from 'next-auth'
import jwt from 'jsonwebtoken'
import CredentialsProvider from 'next-auth/providers/credentials'
import { stringify } from 'qs'
import * as utils from 'utils'

const options = {
  jwt: {
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 15 * 60 // 15 minutes
  },
  session: {
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 15 * 60 // 15 minutes
  },
  pages: {
    signIn: '/login'
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'Username' },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Password'
        }
      },
      async authorize(credentials, req) {
        if (credentials?.username && credentials?.password) {
          const res = await utils.api.post(
            utils.apiRoutes.getUserToken,
            stringify({
              username: credentials?.username,
              password: credentials?.password,
              grant_type: 'password'
            }),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic '.concat(
                  Buffer.from(
                    'yc:c547d72d-607c-429c-81e2-0baec7dd068b'
                  ).toString('base64')
                )
              }
            }
          )
          console.log('res', res)

          if (res.status === 200 && res.data) {
            console.log('Credentials saiu')
            return { ...res.data }
          }
        }

        // Return null if user data could not be retrieved
        return null
      }
    })
  ],
  callbacks: {
    async jwt(token) {
      return token
    },
    async session({ token }) {
      return token.token
    }
  }
}

export default NextAuth(options)
