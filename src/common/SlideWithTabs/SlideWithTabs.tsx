import { Fragment, ReactNode, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import * as common from 'common'

type SlideWithTabsProps = {
  slideSize?: 'normal' | 'halfPage' | 'fullPage'
  noPadding?: boolean
  tabsData: {
    title: string
    color: 'blue' | 'red'
    content: JSX.Element
  }[]
}

export function SlideWithTabs({
  slideSize = 'normal',
  noPadding = false,
  tabsData
}: SlideWithTabsProps) {
  let slidePanelWidth
  switch (slideSize) {
    case 'normal':
      slidePanelWidth = 'max-w-[30%]'
      break
    case 'halfPage':
      slidePanelWidth = 'max-w-[50%]'
      break
    case 'fullPage':
      slidePanelWidth = 'max-w-[80%]'
      break
    default:
      break
  }
  const [slideData, setSlideData] = useState<{
    open: boolean
    content: ReactNode
    title: string
  }>({ open: false, content: <div />, title: '' })

  return (
    <>
      <Transition.Root show={!slideData.open} as={Fragment}>
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-500 sm:duration-700"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-500 sm:duration-700"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div
            className={`absolute  inset-y-0 right-0  z-10 ${slidePanelWidth} items-center justify-start space-y-10  my-36`}
          >
            {tabsData?.map((tab, idx) => {
              return (
                <Button
                  onClick={() => {
                    setSlideData({
                      open: true,
                      content: tab.content,
                      title: tab.title
                    })
                  }}
                  color={tab.color}
                  key={idx}
                >
                  {tab.title}
                </Button>
              )
            })}
          </div>
        </Transition.Child>
      </Transition.Root>

      <Transition.Root show={slideData.open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-hidden"
          onClose={() => null}
        >
          <div className="absolute inset-0 overflow-hidden ">
            <div className="fixed inset-y-0 right-0 flex justify-end max-w-full pl-10 pointer-events-none ">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel
                  className={`w-screen flex pointer-events-auto ${slidePanelWidth} `}
                >
                  <div
                    className={`sticky   inset-y-0 right-0  z-50 ${slidePanelWidth} items-center justify-start space-y-10  my-36`}
                  >
                    {tabsData?.map((tab, idx) => {
                      return (
                        <Button
                          onClick={() => {
                            setSlideData({
                              open: true,
                              content: tab.content,
                              title: tab.title
                            })
                          }}
                          color={tab.color}
                          key={idx}
                        >
                          {tab.title}
                        </Button>
                      )
                    })}
                  </div>
                  <div
                    className={`flex border-l flex-col h-full w-full py-6 overflow-y-scroll bg-white shadow-xl`}
                  >
                    <div className="px-4 mb-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          {slideData.title}
                        </Dialog.Title>

                        <div className="flex items-center ml-3 h-7">
                          <button
                            type="button"
                            className="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() =>
                              setSlideData({
                                ...slideData,
                                open: false
                              })
                            }
                            title="Close"
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="w-6 h-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <common.Separator />
                    <div
                      className={`relative flex-1 mt-6 ${
                        noPadding ? '' : 'px-4 sm:px-6'
                      }`}
                    >
                      {slideData.content}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

type ButtonType = {
  onClick: () => void
  children: ReactNode
  color: 'red' | 'blue'
}
function Button({ onClick, children, color }: ButtonType) {
  let btnColor
  switch (color) {
    case 'blue':
      btnColor = 'border-blue-300'
      break
    case 'red':
      btnColor = 'border-red-300'
      break
  }
  return (
    <div className="-rotate-90 translate-x-1.5">
      <button
        onClick={onClick}
        className={`bg-white border-x-2 border-t-2 p-2 rounded-t-md ${btnColor}`}
      >
        {children}
      </button>
    </div>
  )
}
