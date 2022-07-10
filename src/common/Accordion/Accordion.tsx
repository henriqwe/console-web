import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'
import { ReactNode } from 'react'

type AccordionProps = {
  titles: string
  content: ReactNode
}

export function Accordion({ titles, content }: AccordionProps) {
  return (
    <div className="w-full">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-300 px-4 py-2 text-left text-sm font-mediu hover:bg-gray-200  text-gray-700 font-bold">
              <span>{titles}</span>
              <ChevronUpIcon
                className={`${
                  open ? 'rotate-180 transform' : ''
                } h-5 w-5 text-gray-700 font-bold`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 bg-white rounded-b-lg">
              {content}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  )
}
