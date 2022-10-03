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
        {({ open }: { open: boolean }) => (
          <>
            <Disclosure.Button
              className={`flex w-full items-center justify-between px-6 py-2 text-left text-gray-700 dark:text-text-primary ${
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
              title={title}
            >
              <span className="text-sm font-semibold">{title}</span>
              <ChevronUpIcon
                className={`${
                  open ? 'rotate-180 transform' : ''
                } h-5 w-5 text-gray-700 dark:text-text-primary`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="p-3 text-sm text-gray-500 bg-white dark:text-text-primary dark:bg-menu-secondary">
              {content}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  )
}
