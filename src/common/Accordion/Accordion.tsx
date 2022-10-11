import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'
import { ReactNode } from 'react'

const styleObject = {
  console: {
    accordion: {
      base: 'text-gray-700 dark:text-text-primary',
      isOpen:
        'bg-[#FFF3D5] dark:bg-menu-secondary border-b border-white dark:border-gray-500/50',
      isClosed:
        'hover:bg-[#FFF3D5] dark:hover:bg-menu-secondary bg-gray-200 dark:bg-menu-primary'
    },
    content:
      'text-gray-500 bg-white dark:text-text-primary dark:bg-menu-secondary p-3 text-sm'
  },
  docs: {
    accordion: {
      base: 'text-gray-700 dark:text-text-primary',
      isOpen: '',
      isClosed: ''
    },
    content: 'px-12'
  }
}

type AccordionProps = {
  id?: number
  title: string
  content: ReactNode
  style: 'console' | 'docs'
  defaultOpen?: boolean
  elementRef: any
  action?: () => void
}

export function Accordion({
  id,
  title,
  content,
  style,
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
              className={`flex w-full items-center justify-between px-6 py-2
              ${styleObject[style].accordion.base} ${
                open
                  ? styleObject[style].accordion.isOpen
                  : styleObject[style].accordion.isClosed
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
            <Disclosure.Panel className={styleObject[style].content}>
              {content}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  )
}
