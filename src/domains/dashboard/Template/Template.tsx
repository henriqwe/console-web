/* This example requires Tailwind CSS v2.0+ */
import * as dashboard from 'domains/dashboard'
import { ReactNode, useState } from 'react'
import {
  LogoutIcon,
  InformationCircleIcon,
  CashIcon,
  HomeIcon,
  BookOpenIcon,
  MenuIcon,
  UserIcon
} from '@heroicons/react/outline'
import { removeCookie } from 'utils'
import { ToggleTheme } from 'common'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { routes } from 'domains/routes'

type TemplateProps = {
  children: ReactNode
}

export function Template({ children }: TemplateProps) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    {
      name: 'Projects',
      onClick: () => router.push(routes.dashboard),
      icon: HomeIcon,
      current: router.asPath === routes.dashboard
    },
    {
      name: 'Tutorial And Docs',
      onClick: () => router.push(routes.tutorialsAndDocs),
      icon: BookOpenIcon,
      current: router.asPath === routes.tutorialsAndDocs
    },
    {
      name: 'Help And Support',
      onClick: () => router.push(routes.helpAndSupport),
      icon: InformationCircleIcon,
      current: router.asPath === routes.helpAndSupport
    },
    {
      name: 'My Account',
      onClick: () => router.push(routes.myAccount),
      icon: UserIcon,
      current: router.asPath === routes.myAccount
    }
  ]

  return (
    <div>
      {/* Static sidebar for desktop */}
      <div className="z-20 hidden bg-bg-navigation md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex flex-col flex-1 min-h-0 border-r border-r-gray-700">
          <div className="flex flex-col flex-1 pt-5 pb-4 mx-4 overflow-y-auto">
            <div className="flex items-center justify-between flex-shrink-0 px-4 my-10">
              <img
                className="w-auto h-7"
                src="/assets/images/logo.png"
                alt="Workflow"
              />
              <div className="z-50">
                <ToggleTheme changeColor={false} />
              </div>
            </div>
            <nav className="flex-1 px-2 mt-5 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className={`group flex w-full items-center px-2 py-2 text-xs font-medium rounded-md transition ${
                    item.current
                      ? 'bg-menuItem-ativoEscuro text-text-primary'
                      : 'text-text-tertiary hover:bg-gray-700 hover:text-text-primary'
                  }`}
                >
                  <item.icon
                    className={`mr-4 flex-shrink-0 h-6 w-6 ${
                      item.current
                        ? 'text-text-primary'
                        : 'text-text-tertiary group-hover:text-text-primary'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </button>
              ))}
            </nav>
            <div
              className={`mb-6 flex items-center px-2 py-2 text-sm font-medium rounded-md text-text-secondary hover:text-primary cursor-pointer mx-2 transition`}
            ></div>
            <div
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md text-text-secondary hover:bg-red-700 hover:text-primary cursor-pointer mx-2 transition`}
              onClick={() => {
                removeCookie('X-TenantID')
                removeCookie('admin_access_token')
                removeCookie('access_token')
                signOut()
              }}
            >
              <LogoutIcon
                className={`mr-3 text-xs flex-shrink-0 h-6 w-6 text-text-secondary group-hover:text-text-secondary`}
                aria-hidden="true"
              />
              Logout
            </div>
          </div>
        </div>
      </div>

      <div className="fixed w-full h-screen bg-gray-200 dark:bg-bg-page" />
      <div className="flex flex-col flex-1 w-full h-full md:pl-64">
        <div className="sticky z-50 insset-0 bg-bg-navigation md:hidden">
          <div className="flex items-center justify-between pl-3 pr-2">
            <button
              type="button"
              className={`py-2 duration-150 ${
                sidebarOpen
                  ? 'text-text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="w-7 h-7" aria-hidden="true" />
            </button>
            <ToggleTheme changeColor={false} />
          </div>

          {sidebarOpen && (
            <div className="absolute left-0 w-full py-2 bg-bg-navigation first-letter:md:hidden">
              <div className="flex flex-col gap-y-4">
                <nav className="flex flex-col">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        item.onClick()
                        setSidebarOpen(false)
                      }}
                      className={`group flex w-full items-center px-2 py-2 text-xs font-medium rounded-md transition ${
                        item.current
                          ? 'bg-menuItem-ativoEscuro text-text-primary'
                          : 'text-text-tertiary hover:bg-gray-700 hover:text-text-primary'
                      }`}
                    >
                      <item.icon
                        className={`mr-4 flex-shrink-0 h-6 w-6 ${
                          item.current
                            ? 'text-text-primary'
                            : 'text-text-tertiary group-hover:text-text-primary'
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </button>
                  ))}
                </nav>
                <div
                  className={`group flex items-center justify-center px-2 py-2 text-sm font-medium rounded-md text-text-secondary hover:bg-red-700 hover:text-primary cursor-pointer mx-2 transition`}
                  onClick={() => {
                    removeCookie('X-TenantID')
                    removeCookie('admin_access_token')
                    removeCookie('access_token')
                    signOut()
                  }}
                >
                  <LogoutIcon
                    className={`mr-3 text-xs flex-shrink-0 h-6 w-6 text-text-secondary group-hover:text-text-secondary`}
                    aria-hidden="true"
                  />
                  Logout
                </div>
              </div>
            </div>
          )}
        </div>
        <main className="h-full px-8 pt-10 pb-8 md:px-16">{children}</main>
      </div>
    </div>
  )
}
