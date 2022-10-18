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
import NextNprogress from 'nextjs-progressbar'
import Head from 'next/head'

import type { AppProps } from 'next/app'
import type { UserType } from 'contexts/UserContext'

export default function WrapperApp({
  Component,
  pageProps: { session, ...pageProps },
  ...rest
}: AppProps) {
  return (
    // 24 hours
    <SessionProvider session={session} refetchInterval={24 * 60 * 60}>
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
    if (
      router.asPath !== '/login' &&
      router.asPath !== '/register' &&
      router.asPath !== '/change-password'
    ) {
      if (status === 'unauthenticated') {
        signIn('credentials', { callbackUrl: '/' })
        return
      }
      const timeoutId = setTimeout(() => {
        if (!session) {
          signIn('credentials', { callbackUrl: '/' })
          return
        }
      }, 5000)

      return () => clearTimeout(timeoutId)
    }
  }, [session, status])

  useEffect(() => {
    if (session) {
      utils.setCookie('access_token', session?.accessToken as string)
      setUser({
        ...user,
        ...(session.user as UserType),
        accessToken: session?.accessToken as string,
        ...utils.parseJwt(session?.accessToken as string)
      })
    }
  }, [session])

  if (
    (user && status === 'authenticated') ||
    router.asPath === '/login' ||
    router.asPath === '/register' ||
    router.asPath === '/change-password'
  ) {
    return (
      <>
        <NextNprogress
          color="#29D"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
          showOnShallow={true}
        />
        <Head>
          <title>
            {router.asPath === '/login'
              ? 'Login'
              : router.asPath === '/register'
              ? 'Register'
              : router.asPath === '/change-password'
              ? 'Recover password'
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
      <div className="flex items-center justify-center space-x-4">
        <common.Spinner className="w-10 h-10 text-white" />
        <div className="text-gray-100">Carregando...</div>
      </div>
    </div>
  )
}
