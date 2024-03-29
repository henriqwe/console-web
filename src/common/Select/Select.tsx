import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { DeepMap, FieldError, FieldValues } from 'react-hook-form'

type SelectProps = {
  options: {
    value: any
    name: any
  }[]
  value?: {
    value: any
    name: any
  }
  setValue?: (val: any) => void
  onChange?: (val: any) => void
  errors?: DeepMap<FieldValues, FieldError> & { message?: string }
  disabled?: boolean
  label?: string
  placeholder?: string
}

export const Select = ({
  options,
  value,
  setValue = undefined,
  onChange,
  errors,
  disabled = false,
  label,
  placeholder
}: SelectProps) => {
  const [selected, setSelected] = useState(value)

  return (
    <Listbox
      value={setValue ? value : selected}
      onChange={(val) => {
        setSelected(val)
        onChange && onChange(val)
      }}
      disabled={disabled}
    >
      {({ open }) => (
        <>
          {label && (
            <Listbox.Label className="block mb-2 text-sm font-medium text-gray-700 dark:text-text-primary">
              {label}
            </Listbox.Label>
          )}
          <div className="relative">
            <Listbox.Button
              className="relative w-full py-2 pl-3 min-h-[2.5rem] pr-10 text-left transition bg-white dark:bg-menu-primary border border-gray-300 dark:border-gray-600 rounded-md shadow-sm cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:disabled:bg-menu-secondary disabled:bg-gray-300 disabled:cursor-not-allowed"
              aria-disabled={disabled}
              disabled={disabled}
            >
              <span
                className={`block truncate ${
                  !selected?.name || (setValue && !value?.name)
                    ? 'text-gray-400 dark:text-text-tertiary'
                    : 'dark:text-text-primary'
                }`}
              >
                {setValue ? value?.name : selected?.name || placeholder}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  className="w-5 h-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            {errors && <p className="text-sm text-red-500">{errors.message}</p>}

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg dark:bg-menu-primary dark:border-gray-600 dark:border max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.name}
                    className={({ active }) =>
                      `${
                        active
                          ? 'text-white bg-indigo-600 dark:bg-menu-secondary'
                          : 'text-gray-900 dark:text-text-primary'
                      } cursor-default select-none relative py-2 pl-3 pr-9`
                    }
                    value={option}
                  >
                    {({ active }) => (
                      <>
                        <span
                          className={`
                            ${
                              selected?.name === option.name ||
                              (setValue && value?.name === option.name)
                                ? 'font-semibold'
                                : 'font-normal'
                            }
                            block truncate
                          `}
                          title={option.name}
                        >
                          {option.name}
                        </span>

                        {selected?.name === option.name ||
                        (setValue && value?.name === option.name) ? (
                          <span
                            className={`
                              ${
                                active
                                  ? 'text-white'
                                  : 'text-indigo-600 dark:text-text-primary'
                              }
                              absolute inset-y-0 right-0 flex items-center pr-4
                            `}
                            role="checkicon"
                          >
                            <CheckIcon className="w-5 h-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}
