import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'
import { ReactNode } from 'react'

type AccordionProps = {
  id?: number
  title: string
  content: ReactNode
  defaultOpen?: boolean
  elementRef: any
  action?: () => void
}

export function Accordion({
  id,
  title,
  content,
  defaultOpen = false,
  elementRef,
  action
}: AccordionProps) {
  return (
    <div className={`w-full`}>
      <Disclosure defaultOpen={defaultOpen}>
        {({ open }) => (
          <>
            <Disclosure.Button
              className={`flex w-full items-center justify-between px-6 py-2 text-left font-semibold text-gray-700 dark:text-text-primary ${
                open
                  ? 'bg-[#FFF3D5] dark:bg-menu-secondary border-b border-white dark:border-gray-500/50'
                  : 'hover:bg-[#FFF3D5] dark:hover:bg-menu-secondary bg-gray-200 dark:bg-menu-primary'
              }`}
              ref={elementRef}
              data-id={id}
              onClick={() => {
                if (action) {
                  action()
                }
              }}
            >
              <span className="text-lg">{title}</span>
              <ChevronUpIcon
                className={`${
                  open ? 'rotate-180 transform' : ''
                } h-5 w-5 text-gray-700 dark:text-text-primary`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="p-3 pb-8 text-sm text-gray-500 dark:text-text-primary bg-white dark:bg-menu-secondary">
              {content}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  )
}
