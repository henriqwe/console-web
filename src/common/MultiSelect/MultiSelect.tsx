import { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { DeepMap, FieldError, FieldValues } from 'react-hook-form'

type SelectProps = {
  options: {
    value: any
    name: any
  }[]
  value: {
    value: any
    name: any
  }
  onChange?: (val: any) => void
  errors?: DeepMap<FieldValues, FieldError> & { message?: string }
  disabled?: boolean
  label?: string
}

export const MultiSelect = ({
  options,
  value,
  onChange,
  errors,
  disabled = false,
  label
}: SelectProps) => {
  const [selectedItens, setSelectedItens] = useState([] as typeof options)

  function isSelected(value: typeof options[0] | undefined) {
    return selectedItens.find((el) => el.value === value?.value) ? true : false
  }

  function handleSelection(item: typeof options[0]) {
    const selectedResult = selectedItens.filter(
      (selected) => selected.value === item.value
    )

    if (selectedResult.length > 0) {
      removeItem(item)
      return
    }
    setSelectedItens((currents) => [...currents, item])
  }

  function removeItem(person: typeof options[0]) {
    const removedSelection = selectedItens.filter(
      (selected) => selected.value !== person.value
    )
    setSelectedItens(removedSelection)
  }

  function disableSelectItem(item: typeof options[0] | undefined) {
    const selectItens = selectedItens.map((item) => item.value)

    if (selectItens.includes(item?.value)) {
      return true
    }

    return false
  }

  useEffect(() => {
    onChange && onChange(selectedItens)
  }, [selectedItens])

  return (
    <Listbox value={value} onChange={handleSelection} disabled={disabled}>
      {({ open }) => (
        <>
          {label && (
            <Listbox.Label className="block text-sm font-medium text-gray-700">
              {label}
            </Listbox.Label>
          )}
          <div className="relative">
            <Listbox.Button
              className="relative w-full py-2 pl-3 pr-10 text-left transition bg-white border border-gray-300 rounded-md shadow-sm cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
              aria-disabled={disabled}
              disabled={disabled}
            >
              {selectedItens.length > 0 ? (
                <span className="block truncate">
                  {selectedItens.map((item) => item.name).join(', ')}
                </span>
              ) : (
                <span className="block text-gray-400 truncate">{label}</span>
              )}

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
              <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {options.map((option) => {
                  const selected = isSelected(option)
                  return (
                    <Listbox.Option
                      key={option.name}
                      className={({ active }) =>
                        `${
                          active ? 'text-white bg-indigo-600' : 'text-gray-900'
                        } cursor-default select-none relative py-2 pl-3 pr-9`
                      }
                      value={option}
                    >
                      {({ active }) => (
                        <>
                          <span
                            className={`
                            ${selected ? 'font-semibold' : 'font-normal'}
                            block truncate
                          `}
                          >
                            {option.name}
                          </span>

                          {selected ? (
                            <span
                              className={`
                              ${active ? 'text-white' : 'text-indigo-600'}
                              absolute inset-y-0 right-0 flex items-center pr-4
                            `}
                            >
                              <CheckIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  )
                })}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}