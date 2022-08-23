/* This example requires Tailwind CSS v2.0+ */
import { ChevronRightIcon } from '@heroicons/react/solid'
import { ReactNode } from 'react'

type BreadcrumbProps = {
  pages: { content: ReactNode; current: boolean; action?: () => void }[]
  showNumber?: boolean
}

export function Breadcrumb({ pages, showNumber = false }: BreadcrumbProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2">
        {pages.map((page, index) => (
          <li
            key={index}
            onClick={() => page.action?.()}
            className={`${page.action ? 'hover:cursor-pointer' : ''}`}
          >
            <div className="flex items-between">
              <div
                className={`flex items-center gap-2 mr-2 text-sm font-medium text-center ${
                  page.current
                    ? 'dark:text-text-primary'
                    : 'text-gray-500 dark:text-text-tertiary'
                }`}
                aria-current={page.current ? 'page' : undefined}
              >
                {showNumber && (
                  <span
                    className={`w-5 h-5 text-white ${
                      page.current ? 'bg-blue-500' : 'bg-gray-500'
                    } rounded-full`}
                  >
                    {index + 1}
                  </span>
                )}
                {page.content}
              </div>
              {index + 1 !== pages.length && (
                <ChevronRightIcon
                  className="flex-shrink-0 w-5 h-5 text-gray-400"
                  aria-hidden="true"
                />
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
