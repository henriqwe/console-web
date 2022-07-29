import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'
import { ReactNode, useState } from 'react'

type AccordionProps = {
  content: { title: string; content: ReactNode }[]
}

export function AccordionList({ content }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState(-1)

  return (
    <div className="flex flex-col gap-y-2">
      {content.map((item, index) => {
        return (
          <div className="w-full" key={item.title}>
            <Disclosure>
              <Disclosure.Button
                onClick={() => setOpenIndex(index)}
                className="flex w-full justify-between rounded-lg bg-gray-300 px-4 py-2 text-left text-sm font-mediu hover:bg-gray-200  text-gray-700 font-bold"
              >
                <span>{item.title}</span>
                <ChevronUpIcon
                  className={`${
                    openIndex === index ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-gray-700 font-bold`}
                />
              </Disclosure.Button>
              {openIndex === index && (
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 bg-white rounded-b-lg">
                  {item.content}
                  <button
                    onClick={() => {
                      setOpenIndex(-1)
                    }}
                  >
                    fechar
                  </button>
                </Disclosure.Panel>
              )}
            </Disclosure>
          </div>
        )
      })}
    </div>
  )
}
