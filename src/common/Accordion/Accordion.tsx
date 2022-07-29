import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'
import { ReactNode } from 'react'

type AccordionProps = {
  id?: number
  title: string
  content: ReactNode
  defaultOpen?: boolean
  elementRef: any
  hideOther: () => void
  hideSelf: () => void
}

export function Accordion({
  id,
  title,
  content,
  defaultOpen = false,
  elementRef,
  hideOther,
  hideSelf
}: AccordionProps) {
  return (
    <div className={`w-full`}>
      <Disclosure defaultOpen={defaultOpen}>
        {({ open }) => (
          <>
            <Disclosure.Button
              className={`flex w-full items-center justify-between px-6 py-2 text-left font-semibold text-gray-700 ${
                open ? 'bg-[#FFF3D5]' : 'hover:bg-[#FFF3D5] bg-gray-200 '
              }`}
              ref={elementRef}
              data-id={id}
              onClick={() => {
                if (open) hideSelf()
                else hideOther()
              }}
            >
              <span className="text-xl">{title}</span>
              <ChevronUpIcon
                className={`${
                  open ? 'rotate-180 transform' : ''
                } h-5 w-5 text-gray-700 `}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="text-sm text-gray-500 bg-white px-4 py-3 ">
              {content}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  )
}
