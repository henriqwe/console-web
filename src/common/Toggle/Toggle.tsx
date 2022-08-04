import { Dispatch, SetStateAction } from 'react'
import { Switch } from '@headlessui/react'

type ToggleProps = {
  enabled: boolean
  onChange: (value: boolean) => void
}

export function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <Switch
      checked={enabled}
      onChange={onChange}
      className={`${enabled ? 'bg-indigo-600' : 'bg-gray-200'}
        relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
      />
    </Switch>
  )
}
