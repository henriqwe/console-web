import { createRef, MutableRefObject, ReactNode, useRef } from 'react'
import * as common from 'common'

type AccordionGroupProps = {
  accordionsData: {
    id: number
    title: string
    content: ReactNode
    defaultOpen: boolean
    action: () => void
  }[]
}

export function AccordionGroup({ accordionsData }: AccordionGroupProps) {
  const elementsRef = useRef(accordionsData?.map(() => createRef()))

  const hideOther = (id: number) => {
    let tabIsOpen = false
    const items = elementsRef.current.filter((elm: MutableRefObject<null>) => {
      if (elm?.current?.getAttribute('data-id') !== id.toString()) {
        if (elm?.current?.getAttribute('aria-expanded') === 'true') {
          tabIsOpen = true
        }
        return true
      }
      return false
    })

    if (tabIsOpen) {
      items.forEach((elm) => {
        if (elm?.current?.getAttribute('aria-expanded') === 'true') {
          elm?.current?.click()
        }
      })
      return
    }
    elementsRef.current.forEach((elm) => {
      if (elm?.current?.getAttribute('aria-expanded') === 'true') {
        elm?.current?.click()
      }
    })
  }

  const hideSelf = (id: number) => {
    const items = elementsRef.current.filter((elm: MutableRefObject<null>) => {
      if (elm?.current?.getAttribute('data-id') === id.toString()) {
        return true
      }
      return false
    })

    items.forEach((elm) => {
      if (elm?.current?.getAttribute('aria-expanded') === 'true') {
        elm?.current?.setAttribute('aria-expanded', false)
      }
    })
  }

  return (
    <div className={`w-full`}>
      {accordionsData.map((accordionData, idx) => {
        return (
          <div
            onClick={() => {
              accordionData.action()
            }}
            key={idx}
          >
            <common.Accordion
              title={accordionData.title}
              content={accordionData.content}
              defaultOpen={accordionData.defaultOpen}
              elementRef={elementsRef.current[idx]}
              id={accordionData.id}
              hideOther={() => hideOther(accordionData.id)}
              hideSelf={() => hideSelf(accordionData.id)}
            />
          </div>
        )
      })}
    </div>
  )
}
