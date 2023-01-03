import { ToggleTheme } from 'common'
import * as ThemeContext from 'contexts/ThemeContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
const backgroundImage = '/assets/images/bg-green-2-darker.jpg'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { isDark } = ThemeContext.useTheme()
  const [logoImgSrc, setLogoImgSrc] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    setLogoImgSrc(
      isDark
        ? '/assets/images/logoTextLight.png'
        : '/assets/images/logoTextDark.png'
    )
  }, [isDark])

  return (
    <>
      <div className="relative flex h-screen px-0 justify-cenfer">
        <div className="relative z-10 flex flex-col flex-1 px-4 py-10 bg-white shadow-2xl dark:bg-bg-page sm:justify-center md:flex-none md:px-28">
          <div className="w-full max-w-md mx-auto sm:px-4 md:w-96 md:max-w-sm md:px-0">
            <div className="flex flex-col">
              <div className="flex justify-between">
                
                  <img
                    src={logoImgSrc}
                    data-testid="Logo"
                    alt="Logo"
                    className="self-start object-contain h-10"
                  />
                <ToggleTheme />
              </div>
              <div className="mt-20">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-text-primary">
                  Ycodify Web Console
                </h2>
                <p className="mt-2 text-sm text-gray-700 dark:text-text-secondary">
                  {`${
                    router.pathname === '/login'
                      ? "Don't have an account?"
                      : 'Have an account?'
                  }`}{' '}
                  <Link
                    href={router.pathname === '/login' ? '/register' : '/login'}
                  >
                    <a className="font-medium text-blue-600 cursor-pointer dark:text-blue-400 hover:underline">
                      {`${
                        router.pathname === '/login' ? 'Sign up!' : 'Login!'
                      }`}
                    </a>
                  </Link>
                </p>
              </div>
            </div>
            {children}
          </div>


          
        
        </div>
        
        <div className="hidden sm:contents lg:relative lg:block lg:flex-1">
          <img
            className="absolute inset-0 object-cover w-full h-full"
            src={backgroundImage}
            alt=""
          />
        </div>
      </div>
    </>
  )
}
