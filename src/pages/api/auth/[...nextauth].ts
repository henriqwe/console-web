import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import * as services from 'services'

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
            const res = await services.ycodify.getUserToken({
              username: credentials?.username,
              password: credentials?.password
            })
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
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.accessToken = user.access_token
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken
      return session
    }
  }
}

export default NextAuth(options)
