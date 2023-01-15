import * as common from 'common'
import {
  Dispatch,
  Fragment,
  ReactNode,
  SetStateAction,
  useRef,
  useState
} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon } from '@heroicons/react/outline'

type ModalProps = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  title: string
  description?: ReactNode
  buttonTitle: string
  handleSubmit: () => void
  disabled?: boolean
  loading?: boolean
}

export function Modal({
  open,
  setOpen,
  title,
  description,
  buttonTitle,
  handleSubmit,
  disabled = false,
  loading = false
}: ModalProps) {
  const cancelButtonRef = useRef(null)

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-bg-page dark:bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:max-w-lg sm:w-full">
                <div className="px-4 pt-5 pb-4 bg-white dark:bg-menu-primary sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationIcon
                        className="w-6 h-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left ">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900 dark:text-text-primary "
                      >
                        {title}
                      </Dialog.Title>
                      <div className="w-full mt-2 dark:text-text-primary">
                        {description}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 dark:bg-menu-primary/95 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center w-full gap-2 px-4 py-2 text-base font-medium text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-75 disabled:cursor-not-allowed"
                    onClick={async () => {
                      await handleSubmit()
                      setOpen(false)
                    }}
                    role="button"
                    data-testid="modalButton"
                    disabled={disabled}
                  >
                    {loading && (
                      <div className="w-4 h-4">
                        <common.Spinner />
                      </div>
                    )}
                    {buttonTitle}
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm dark:text-text-primary dark:bg-menuItem-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                    role="cancelButton"
                    ref={cancelButtonRef}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
