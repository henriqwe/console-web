/* This example requires Tailwind CSS v2.0+ */
import { ChevronRightIcon } from '@heroicons/react/solid'

type BreadcrumbProps = {
  pages: { name: string; current: boolean }[]
  showNumber?: boolean
}

export function Breadcrumb({ pages, showNumber = false }: BreadcrumbProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        {pages.map((page, index) => (
          <li key={page.name}>
            <div className="flex items-between">
              <p
                className={`flex items-center gap-2 mr-4 text-sm font-medium text-center ${
                  page.current
                    ? 'dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
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
                {page.name}
              </p>
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
