import { Fragment, ReactNode } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

type DropdownProps = {
  actions: { title: string; onClick: () => void }[]
  children: ReactNode
  withoutChevronDownIcon?: boolean
}

export function Dropdown({
  actions,
  children,
  withoutChevronDownIcon = false
}: DropdownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className="flex items-center px-2 py-1  rounded-md dark:text-text-secondary hover:text-gray-800 dark:hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 font-medium"
          title="open options"
        >
          {children}
          {!withoutChevronDownIcon && (
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5"
              aria-hidden="true"
            />
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
        <Menu.Items className="absolute w-full mt-1 origin-top-right bg-white rounded-md shadow-lg dark:bg-menu-primary ring-1 ring-black ring-opacity-5 focus:outline-none">
          {actions.map((action, index) => (
            <Menu.Item key={action.title}>
              {({ active }: { active: boolean }) => (
                <a
                  className={`${index === 0 ? 'rounded-t-md' : ''} 
                  ${index === actions.length - 1 ? 'rounded-b-md' : ''}
                  ${
                    active
                      ? 'bg-gray-100 dark:bg-menu-secondary text-gray-900 dark:text-text-primary'
                      : 'text-gray-700 dark:text-text-secondary'
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
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
