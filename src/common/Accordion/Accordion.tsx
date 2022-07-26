import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'
import { ReactNode } from 'react'

type AccordionProps = {
  titles: string
  content: ReactNode
}

export function Accordion({ titles, content }: AccordionProps) {
  return (
    <div className={`w-full`}>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button
              className={`flex w-full items-center justify-between px-6 py-2 text-left font-semibold text-gray-700 ${
                open ? 'bg-[#FFF3D5]' : 'hover:bg-[#FFF3D5] bg-gray-200 '
              }`}
            >
              <span className="text-xl">{titles}</span>
              <ChevronUpIcon
                className={`${
                  open ? 'rotate-180 transform' : ''
                } h-5 w-5 text-gray-700 `}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-1 pb-8 text-sm text-gray-500 bg-white ">
              {content}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  )
}
