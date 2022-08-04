import { Dispatch, Fragment, ReactNode, SetStateAction } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import * as common from 'common'

type SlideProps = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  title: string
  content: ReactNode
  slideSize?: 'normal' | 'halfPage' | 'fullPage'
  noPadding?: boolean
}

export function Slide({
  open,
  setOpen,
  title,
  content,
  slideSize = 'normal',
  noPadding = false
}: SlideProps) {
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
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-hidden"
        onClose={() => null}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="fixed inset-y-0 right-0 flex justify-end max-w-full pl-10 pointer-events-none">
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
                className={`z-50 w-screen pointer-events-auto ${slidePanelWidth}`}
              >
                <div
                  className={`border-l-gray-700 border-l flex flex-col h-full py-6 overflow-y-auto bg-white dark:bg-gray-800 shadow-xl`}
                >
                  <div className="px-4 mb-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {title}
                      </Dialog.Title>

                      <div className="flex items-center ml-3 h-7">
                        <button
                          type="button"
                          className="text-gray-400 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          onClick={() => setOpen(false)}
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
                    className={`relative dark:text-gray-200 flex-1 mt-6 ${
                      noPadding ? '' : 'px-4 sm:px-6'
                    }`}
                  >
                    {content}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
