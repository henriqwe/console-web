import { CheckIcon, PlusIcon } from '@heroicons/react/outline'

type RadioCheckIconProps = { checked: boolean }

export function RadioCheckIcon({ checked }: RadioCheckIconProps) {
  return (
    <div>
      {checked ? (
        <div className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-500  text-white ">
          <CheckIcon className="w-3 h-3" />
        </div>
      ) : (
        <div className="flex items-center justify-center w-4 h-4 rounded-full border border-gray-500 text-gray-500 dark:border-gray-300 dark:text-gray-300">
          <PlusIcon className="w-2 h-2" />
        </div>
      )}
    </div>
  )
}
