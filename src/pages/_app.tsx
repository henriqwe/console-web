import 'styles/main.css'
import 'react-toastify/dist/ReactToastify.css'
import * as ThemeContext from 'contexts/ThemeContext'
import * as PixelContext from 'contexts/PixelContext'
import * as common from 'common'
import * as utils from 'utils'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { UserProvider, useUser } from 'contexts/UserContext'
import * as LocalTourContext from 'contexts/TourContext'
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

  async function getUserData() {
    let res = undefined
    try {
      res = await utils.api.get(utils.apiRoutes.userData, {
        headers: {
          Authorization: session?.accessToken as string
        }
      })
    } catch (error) {
      console.error('Error fetching user data', error)
    }

    return res?.data
  }

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

      getUserData().then(async (userData) => {
        setUser({
          ...user,
          ...(session.user as UserType),
          accessToken: session?.accessToken as string,
          userData: userData,
          gatewayPaymentKey: userData?.gatewayPaymentKey
        })
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
              ? 'Login - Ycodify'
              : router.asPath === '/register'
              ? 'Register - Ycodify'
              : router.asPath === '/change-password'
              ? 'Recover Password - Ycodify'
              : null}
          </title>
          <link rel="icon" href="/assets/images/favicon.ico" />
        </Head>
        <ThemeContext.ThemeProvider>
          <PixelContext.PixelProvider>
            <LocalTourContext.TourProvider>
              <Component {...pageProps} />
              <ToastContainer closeOnClick={false} />
            </LocalTourContext.TourProvider>
          </PixelContext.PixelProvider>
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
