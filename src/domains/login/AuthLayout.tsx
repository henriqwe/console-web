import { ToggleTheme } from 'common'
import * as ThemeContext from 'contexts/ThemeContext'
import { useEffect, useState } from 'react'
import * as login from 'domains/login'

const backgroundImage = '/assets/images/bg-green-2-darker.jpg'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { formType, setFormType } = login.useLogin()
  const { isDark } = ThemeContext.useTheme()
  const [logoImgSrc, setLogoImgSrc] = useState<string>('')

  useEffect(() => {
    setLogoImgSrc(
      isDark
        ? '/assets/images/logoTextLight.png'
        : '/assets/images/logoTextDark.png'
    )
  }, [isDark])

  return (
    <>
      <div className="justify-cenfer relative flex h-screen px-0">
        <div className="relative z-10 flex flex-1 flex-col dark:bg-bg-page bg-white py-10 px-4 shadow-2xl sm:justify-center md:flex-none md:px-28">
          <div className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
            <div className="flex flex-col">
              <div className="flex justify-between">
                <a
                  href="https://ycodify.com/"
                  aria-label="Home"
                  className="cursor-pointer w-max"
                >
                  <img
                    src={logoImgSrc}
                    alt="Logo"
                    className="h-10 object-contain self-start"
                  />
                </a>
                <ToggleTheme />
              </div>
              <div className="mt-20">
                <h2 className="text-lg font-semibold dark:text-text-primary text-gray-900">
                  Ycodify Web Console
                </h2>
                <p className="mt-2 text-sm dark:text-text-secondary text-gray-700">
                  {`${
                    formType === 'login'
                      ? 'Não possui uma conta?'
                      : 'Possui uma conta?'
                  }`}{' '}
                  <span
                    onClick={() =>
                      setFormType(formType === 'login' ? 'create' : 'login')
                    }
                    className="font-medium dark:text-blue-400 text-blue-600 hover:underline cursor-pointer"
                  >
                    {`${formType === 'login' ? 'Cadastre-se!' : 'Faça login!'}`}
                  </span>
                </p>
              </div>
            </div>
            {children}
          </div>
        </div>
        <div className="hidden sm:contents lg:relative lg:block lg:flex-1">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={backgroundImage}
            alt=""
          />
        </div>
      </div>
    </>
  )
}
