/* This example requires Tailwind CSS v2.0+ */
import { Fragment, ReactNode, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  LogoutIcon,
  InformationCircleIcon,
  CashIcon,
  HomeIcon,
  BookOpenIcon,
  MenuIcon,
  UserIcon,
  XIcon,
  DocumentTextIcon
} from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import { removeCookie } from 'utils'
import { routes } from 'domains/routes'

const navigation = [
  { name: 'Projects', href: '#', icon: HomeIcon, current: true },
  { name: 'Billing', href: '#', icon: CashIcon, current: false },
  { name: 'Docs', href: '#', icon: DocumentTextIcon, current: false },
  { name: 'Tutorial', href: '#', icon: BookOpenIcon, current: false },
  {
    name: 'Help And Suport',
    href: '#',
    icon: InformationCircleIcon,
    current: false
  },
  { name: 'My Account', href: '#', icon: UserIcon, current: false }
]

type TemplateProps = {
  children: ReactNode
}

export function Template({ children }: TemplateProps) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <div>
        {/* Static sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-col flex-1 min-h-0 bg-gray-800">
            <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto mx-4">
              <div className="flex items-center flex-shrink-0 px-4 my-10">
                <img
                  className="w-auto h-7"
                  src="/assets/images/logo.png"
                  alt="Workflow"
                />
              </div>
              <nav className="flex-1 px-2 mt-5 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-xs font-medium rounded-md transition ${
                      item.current
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <item.icon
                      className={`mr-4 flex-shrink-0 h-6 w-6 ${
                        item.current
                          ? 'text-gray-300'
                          : 'text-gray-400 group-hover:text-gray-300'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
              </nav>
              <div
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-red-700 hover:text-white cursor-pointer mx-2 transition`}
                onClick={() => {
                  removeCookie('X-TenantID')
                  removeCookie('admin_access_token')
                  removeCookie('access_token')
                  router.push(routes.login)
                }}
              >
                <LogoutIcon
                  className={`mr-3 text-xs flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-300`}
                  aria-hidden="true"
                />
                Logout
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 md:pl-64">
          <div className="sticky top-0 z-10 pt-1 pl-1 bg-gray-100 md:hidden sm:pl-3 sm:pt-3">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </>
  )
}
