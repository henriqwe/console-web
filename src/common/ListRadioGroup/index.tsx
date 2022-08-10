import { RadioGroup } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/outline'
import React, { Dispatch, SetStateAction, useState, ReactNode } from 'react'

type ListRadioGroupProps = {
  options: { value: string; content: ReactNode }[]
  setSelectedOption: Dispatch<SetStateAction<string>>
  horizontal?: boolean
  selectedValue?: { value: string; content: ReactNode }
  disabled?: boolean
  compact?: boolean
  disabledCheckBoxIcon?: boolean
  showCheckIcon?: boolean
}

export function ListRadioGroup({
  options,
  setSelectedOption,
  horizontal = false,
  selectedValue,
  disabled = false,
  disabledCheckBoxIcon = false,
  showCheckIcon = true,
  compact
}: ListRadioGroupProps) {
  const [selected, setSelected] = useState<{
    value: string
    content: ReactNode
  }>(
    selectedValue
      ? selectedValue
      : ({} as { value: string; content: ReactNode })
  )

  return (
    <div className="w-full">
      <div className="w-full mx-auto">
        <RadioGroup
          disabled={disabled}
          value={selected}
          onChange={(e: { value: string; content: ReactNode }) => {
            setSelected(e)
            setSelectedOption(e?.value)
          }}
        >
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div
            className={
              horizontal
                ? 'flex gap-4 justify-start my-2 items-center flex-wrap'
                : 'space-y-2'
            }
            role="list-group"
          >
            {options.map((opcao, indice) => (
              <RadioGroup.Option
                key={`radio-grupo-item-${indice}`}
                value={opcao}
                className={({ active }) =>
                  `
                  ${
                    disabled && !(opcao.value === selected?.value)
                      ? '!bg-gray-400 dark:bg-menu-secondary cursor-not-allowed'
                      : disabled
                      ? 'bg-gray-400 cursor-not-allowed'
                      : ''
                  }
                  
                  ${
                    active
                      ? 'ring-2 ring-offset !ring-offset-sky-300 !ring-gray-400 ring-opacity-40'
                      : ''
                  }
                  
                  ${
                    opcao.value === selected?.value
                      ? '!bg-blue-200 bg-opacity-50 dark:!bg-menu-secondary !text-gray-800 ring-2 ring-offset !ring-offset-sky-300 !ring-gray-400 ring-opacity-40'
                      : 'bg-gray-100 dark:bg-menu-primary'
                  } 
                  ${horizontal ? 'flex-1 mt-0' : ''}  
                    relative rounded-lg shadow-md ${
                      compact ? 'px-2 py-2' : 'px-5 py-4'
                    } cursor-pointer flex focus:outline-none
                  `
                }
              >
                <div className="flex items-center justify-between w-full dark:text-text-primary">
                  {opcao.content}
                  {opcao.value === selected?.value &&
                    !disabledCheckBoxIcon &&
                    showCheckIcon && (
                      <div className="flex-shrink-0 text-blue-700 dark:text-text-primary">
                        <CheckCircleIcon className="w-6 h-6" />
                      </div>
                    )}
                </div>
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
