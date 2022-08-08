import { Fragment, ReactNode, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import * as common from 'common'

type SlideWithTabsProps = {
  slideSize?: 'normal' | 'halfPage' | 'fullPage'
  noPadding?: boolean
  tabsData: tabsDataType[]
}

type tabsDataType = {
  title: string
  color: 'blue' | 'red'
  content: JSX.Element
}

type slideDataType = {
  open: boolean
  content: ReactNode
  title: string
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
  const [slideData, setSlideData] = useState<slideDataType>({
    open: false,
    content: <div />,
    title: ''
  })
  const [activeTab, setActiveTab] = useState<tabsDataType>()

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
            className={`absolute flex flex-col inset-y-0 right-0 z-10 ${slidePanelWidth} w-0 items-end justify-end space-y-10 my-24`}
          >
            {tabsData?.map((tab, idx) => {
              return (
                <Button
                  activeTab={activeTab}
                  onClick={() => {
                    setActiveTab(tab)
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
          className="fixed inset-0 z-10 overflow-hidden "
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
                    className={`sticky flex flex-col inset-y-0 right-0 z-10 ${slidePanelWidth} w-0 items-end justify-end space-y-10 my-24 `}
                  >
                    {tabsData?.map((tab, idx) => {
                      return (
                        <Button
                          activeTab={activeTab}
                          onClick={() => {
                            setActiveTab(tab)
                            setSlideData({
                              open: true,
                              content: tab.content,
                              title: tab.title
                            })
                          }}
                          color={tab.color}
                          key={tab.title + idx}
                        >
                          {tab.title}
                        </Button>
                      )
                    })}
                  </div>
                  <div
                    className={`flex border-l border-menu-primary flex-col h-full w-full py-6 overflow-y-scroll bg-white dark:bg-menu-primary shadow-xl ${
                      activeTab?.color === 'red'
                        ? 'border-red-300 dark:border-red-700/50'
                        : activeTab?.color === 'blue'
                        ? 'border-blue-500 dark:border-blue-700/50'
                        : ''
                    } `}
                  >
                    <div className="px-4 mb-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-text-primary">
                          {slideData.title}
                        </Dialog.Title>

                        <div className="flex items-center ml-3 h-7">
                          <button
                            type="button"
                            className="text-gray-400 rounded-md hover:text-text-tertiary dark:hover:text-text-secondary focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => {
                              setActiveTab(undefined)
                              setSlideData({
                                ...slideData,
                                open: false
                              })
                            }}
                            title="Close"
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="w-6 h-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <common.Separator className="dark:border-gray-700" />
                    <div
                      className={`relative flex-1 mt-6 dark:text-text-primary
                      ${noPadding ? '' : 'px-4 sm:px-6'}
                      `}
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
  activeTab: tabsDataType | undefined
}
function Button({ onClick, children, color, activeTab }: ButtonType) {
  let borderColor
  let bgColor
  let textColor
  switch (color) {
    case 'blue':
      borderColor = 'border-blue-300 dark:border-blue-700/50'
      bgColor = 'bg-blue-500 dark:bg-blue-800'
      textColor = 'text-white'
      break
    case 'red':
      borderColor = 'border-red-500 dark:border-red-700/50'
      bgColor = 'bg-red-500 dark:bg-red-800'
      textColor = 'text-white'
      break
  }
  return (
    <button
      onClick={onClick}
      className={`border-y-2 border-l-2 p-2 rounded-l-md dark:text-text-primary ${borderColor} ${
        activeTab?.title === children
          ? `${bgColor} ${textColor} `
          : 'bg-white dark:bg-menu-secondary'
      }`}
    >
      <span className="rotate-180" style={{ writingMode: 'vertical-rl' }}>
        {children}
      </span>
    </button>
  )
}
