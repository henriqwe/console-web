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
  style?: 'console' | 'docs'
  gap?: string
  hideSelf?: boolean
}

export function AccordionGroup({
  accordionsData,
  style = 'console',
  gap,
  hideSelf = false
}: AccordionGroupProps) {
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

    if (tabIsOpen || hideSelf) {
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

  return (
    <div className={`flex flex-col w-full ${gap}`}>
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
              style={style}
              defaultOpen={accordionData.defaultOpen}
              elementRef={elementsRef.current[idx]}
              id={accordionData.id}
              action={() => hideOther(accordionData.id)}
            />
          </div>
        )
      })}
    </div>
  )
}
