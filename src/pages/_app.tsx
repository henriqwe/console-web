import 'styles/main.css'
import 'react-toastify/dist/ReactToastify.css'
import * as ThemeContext from 'contexts/ThemeContext'
import * as common from 'common'
import * as utils from 'utils'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { UserProvider, useUser } from 'contexts/UserContext'
import { SessionProvider, useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import type { AppProps } from 'next/app'
import type { UserType } from 'contexts/UserContext'

export default function WrapperApp({
  Component,
  pageProps: { session, ...pageProps },
  ...rest
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <UserProvider>
        <ConsoleWebApp Component={Component} pageProps={pageProps} {...rest} />
      </UserProvider>
    </SessionProvider>
  )
}

function ConsoleWebApp({ Component, pageProps }: AppProps) {
  const { data: session, status } = useSession()
  const { user, setUser } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (router.asPath !== '/login' && router.asPath !== '/register') {
      if (status === 'unauthenticated') {
        signIn('credentials', { callbackUrl: '/' })
        return null
      }
      const timeoutId = setTimeout(() => {
        if (!session) {
          signIn('credentials', { callbackUrl: '/' })
          return null
        }
      }, 5000)

      return () => clearTimeout(timeoutId)
    }
  }, [session, status])

  useEffect(() => {
    if (session) {
      utils.setCookie('access_token', session?.accessToken as string)
      setUser({
        ...(session.user as UserType),
        accessToken: session?.accessToken as string,
        ...utils.parseJwt(session?.accessToken as string)
      })
    }
  }, [session])

  if (
    (user && status === 'authenticated') ||
    router.asPath === '/login' ||
    router.asPath === '/register'
  ) {
    return (
      <>
        <Head>
          <title>
            {router.asPath === '/login'
              ? 'Login'
              : router.asPath === '/register'
              ? 'Register'
              : null}
          </title>
          <link rel="icon" href="/assets/images/favicon.ico" />
        </Head>
        <ThemeContext.ThemeProvider>
          <Component {...pageProps} />
          <ToastContainer closeOnClick={false} />
        </ThemeContext.ThemeProvider>
      </>
    )
  }
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="flex  space-x-4 justify-center items-center">
        <common.Spinner className="w-10 h-10 text-white" />
        <div className="text-gray-100">Carregando...</div>
      </div>
    </div>
  )
}
