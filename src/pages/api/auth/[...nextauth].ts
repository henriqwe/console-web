import NextAuth from 'next-auth'
import jwt from 'jsonwebtoken'
import CredentialsProvider from 'next-auth/providers/credentials'
import { stringify } from 'qs'
import * as utils from 'utils'

const options = {
  jwt: {
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 24 * 60 * 60 // 24 hours
  },
  session: {
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 24 * 60 * 60 // 24 hours
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
        try {
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
            if (res.status === 200 && res.data) {
              return { ...res.data }
            }
          }

          return null
        } catch (err: any) {
          if (err.response?.status === 401) {
            throw new Error('Ops! Incorrect username or password')
          }
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      return session
    }
  }
}

export default NextAuth(options)
