import * as common from 'common'
import { ReactNode, useState } from 'react'
import {
  LogoutIcon,
  InformationCircleIcon,
  CashIcon,
  HomeIcon,
  BookOpenIcon,
  MenuIcon,
  UserIcon,
  UserCircleIcon,
  UserGroupIcon,
  PlusIcon
} from '@heroicons/react/outline'
import { removeCookie } from 'utils'
import { ToggleTheme } from 'common'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { routes } from 'domains/routes'
import { BetaTag } from 'common/BetaTag'
import { useUser } from 'contexts/UserContext'

type TemplateProps = {
  children: ReactNode
}

export function Template({ children }: TemplateProps) {
  const { user } = useUser()

  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedOrganization, setSelectedOrganization] = useState<{
    name: string
    plan: string
  }>({ name: 'Seniors Demais', plan: 'Starter' })
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
      icon: UserCircleIcon,
      current: router.asPath === routes.myAccount
    }
  ]
  const dropdownActions = [
    {
      title: 'Seniors Demais',
      onClick: () => {
        setSelectedOrganization({ name: 'Seniors Demais', plan: 'Starter' })
      }
    },
    {
      title: 'UX-tudo',
      onClick: () => {
        setSelectedOrganization({ name: 'UX-tudo', plan: 'Free' })
      }
    },
    ,
    {
      title: 'Org TOP',
      onClick: () => {
        setSelectedOrganization({ name: 'Org TOP', plan: 'Top' })
      }
    }
  ]
  const dropdownSubActions = [
    {
      title: 'Create new organization',
      onClick: () => {
        return
      },
      icon: <PlusIcon className={`flex-shrink-0 h-4 w-4`} />
    }
  ]
  return (
    <div>
      {/* Static sidebar for desktop */}
      <div className="dashboard-step-1 z-20 hidden bg-bg-navigation md:flex md:w-96 md:flex-col md:fixed md:inset-y-0">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex flex-col flex-1 min-h-0 border-r border-r-gray-700">
          <div className="flex flex-col flex-1 pt-5 pb-4 mx-4 overflow-y-auto">
            <div className="flex items-center justify-between flex-shrink-0 px-4 my-10">
              <div className="flex w-max gap-x-4">
                <img
                  className="h-6 w-auto"
                  src="/assets/images/logoTextLight.png"
                  alt="Workflow"
                />
                <BetaTag />
              </div>

              <div className="z-50">
                <ToggleTheme changeColor={false} />
              </div>
            </div>
            <div className="flex gap-2 px-4 items-center">
              <UserIcon className={`flex-shrink-0 h-6 w-6 text-text-primary`} />
              <div>
                <div
                  className="flex  text-text-secondary  items-center h-8 px-2 text-lg "
                  title="Username"
                >
                  <span>{user?.userData?.username}</span>
                </div>

                <common.Dropdown
                  actions={dropdownActions.filter(
                    (option) => option?.title !== selectedOrganization.name
                  )}
                  subActions={dropdownSubActions}
                  withoutHover
                  title="Organization"
                  darkBackground
                >
                  <div className="flex w-full gap-2 items-center">
                    <span className="truncate text-xs">
                      {selectedOrganization.name}
                    </span>
                    <span className="text-[.7rem] px-2 py-1  rounded-full border border-yc  text-text-primary">
                      {selectedOrganization.plan}
                    </span>
                  </div>
                </common.Dropdown>
              </div>
            </div>
            <div className="px-4 my-2">
              <common.Separator className="border-gray-700 rounded-full" />
            </div>
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item, index) => (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className={`group flex w-full items-center px-2 py-2 text-xs font-medium rounded-md transition ${
                    item.current
                      ? 'bg-menuItem-ativoEscuro text-text-primary'
                      : 'text-text-tertiary hover:bg-gray-700 hover:text-text-primary'
                  } dashboard-step-${index + 2}`}
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
      <div className="flex flex-col flex-1 w-full h-full md:pl-[22rem]">
        <div className="sticky z-50 insset-0 bg-bg-navigation md:hidden">
          <div className="flex items-center justify-between pl-3 pr-2">
            <button
              type="button"
              className={`items-center py-2 duration-150 ${
                sidebarOpen
                  ? 'text-text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="w-7 h-7" aria-hidden="true" />
            </button>
            <div className="flex gap-x-4">
              <img
                className="h-6 w-auto"
                src="/assets/images/logomarkTextLight.png"
                alt="Workflow"
              />
              <BetaTag />
            </div>
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
        <main className="h-full px-8 pt-10 pb-8 md:px-16 md:pl-24">
          {children}
        </main>
      </div>
    </div>
  )
}
