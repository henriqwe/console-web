import { Fragment, ReactNode } from 'react'
import { Menu, Transition } from '@headlessui/react'

type DropdownProps = {
  actions: { title: string; onClick: () => void }[]
  children: ReactNode
}

export function Dropdown({ actions, children }: DropdownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
          <span className="sr-only">Open options</span>
          {children}
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
        <Menu.Items className="absolute w-56 mt-2 origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {actions.map((action) => (
              <Menu.Item key={action.title}>
                {({ active }: { active: boolean }) => (
                  <a
                    className={`dark:hover:bg-gray-700
                  ${
                    active
                      ? 'bg-gray-100 text-gray-900 dark:text-gray-100'
                      : 'text-gray-700 dark:text-gray-400'
                  }
                  block px-4 py-2 text-sm cursor-pointer`}
                    onClick={action.onClick}
                  >
                    {action.title}
                  </a>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
