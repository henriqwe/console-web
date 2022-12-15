import { Fragment, ReactNode } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import * as common from 'common'
type DropdownProps = {
  actions: { title: string; onClick: () => void; icon?: ReactNode }[]
  children: ReactNode
  subActions?: { title: string; onClick: () => void; icon?: ReactNode }[]
  withoutChevronDownIcon?: boolean
  title?: string
  withoutHover?: boolean
  darkBackground?: boolean
}

export function Dropdown({
  actions,
  children,
  subActions = [],
  withoutChevronDownIcon = false,
  withoutHover = false,
  title = 'Open options',
  darkBackground
}: DropdownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left w-full ">
      <div className="w-full ">
        <Menu.Button
          className={`flex w-full items-center rounded-md  focus:outline-none  font-medium ${
            withoutHover
              ? ''
              : 'hover:text-gray-800 dark:hover:text-text-primary'
          } ${
            darkBackground ? 'text-text-secondary' : 'dark:text-text-secondary'
          }`}
          title={title}
        >
          {children}
          {!withoutChevronDownIcon && (
            <ChevronDownIcon className="-mr-1 h-5 w-5" aria-hidden="true" />
          )}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`flex flex-col absolute w-full my-1 origin-top-right  rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
            darkBackground
              ? 'bg-menu-primary'
              : 'dark:bg-menu-primary bg-white '
          }`}
        >
          {actions.map((action, index) => (
            <Menu.Item key={action.title}>
              {({ active }: { active: boolean }) => (
                <a
                  className={`${index === 0 ? 'rounded-t-md' : ''} 
                  ${index === actions.length - 1 ? 'rounded-b-md' : ''}
                  ${
                    active && !darkBackground
                      ? `bg-gray-100 dark:bg-menu-secondary text-gray-900 dark:text-text-primary`
                      : 'text-gray-700 dark:text-text-secondary'
                  }
                  ${
                    active && darkBackground
                      ? 'bg-menu-secondary text-text-primary'
                      : 'text-text-secondary'
                  }
                  block px-4 py-2 text-sm cursor-pointer`}
                  onClick={action.onClick}
                  title={action.title}
                >
                  {action.title}
                </a>
              )}
            </Menu.Item>
          ))}
          {subActions.length > 0 && (
            <common.Separator
              className={`${darkBackground ? 'border-gray-700' : ''}`}
            />
          )}
          {subActions.map((action, index) => (
            <Menu.Item key={action.title}>
              {({ active }: { active: boolean }) => (
                <a
                  className={`
                  ${
                    active && !darkBackground
                      ? `bg-gray-100 dark:bg-menu-secondary text-gray-900 dark:text-text-primary`
                      : 'text-gray-700 dark:text-text-secondary'
                  }
                  ${
                    active && darkBackground
                      ? 'bg-menu-secondary text-text-primary'
                      : 'text-text-secondary'
                  }
                  flex rounded-md items-center px-4 py-2 text-sm cursor-pointer gap-2 w-full`}
                  onClick={action.onClick}
                  title={action.title}
                >
                  {action?.icon}
                  <span> {action.title}</span>
                </a>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
