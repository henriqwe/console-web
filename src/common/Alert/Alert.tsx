import { ReactNode } from 'react'
import { ExclamationIcon } from '@heroicons/react/outline'

export const Alert = ({
  children,
  title,
  theme = 'info'
}: {
  children: ReactNode
  title?: string
  theme?: 'info' | 'warning' | 'danger'
}) => {
  let borderTopColor = ''
  let textColor = ''
  let backgroundColor = ''
  let icon = <div />
  switch (theme) {
    case 'info':
      borderTopColor = '!border-teal-500'
      textColor = 'text-teal-900'
      backgroundColor = 'bg-teal-100'
      icon = (
        <svg
          className="w-6 h-6 mr-4 text-teal-500 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"
            fill={'#14B8A6'}
          />
        </svg>
      )
      break
    case 'warning':
      borderTopColor = '!border-yellow-500'
      textColor = 'text-yellow-900'
      backgroundColor = 'bg-yellow-100'
      icon = (
        <ExclamationIcon className="w-6 h-6 mr-4 text-yellow-500 fill-current" />
      )
      break
    case 'danger':
      borderTopColor = '!border-red-500'
      textColor = 'text-red-900'
      backgroundColor = 'bg-red-100'
      icon = (
        <ExclamationIcon className="w-6 h-6 mr-4 text-red-500 fill-current" />
      )
      break
  }
  return (
    <div
      className={`px-4 py-3 w-full border-t-4 rounded-b shadow-md ${borderTopColor} ${textColor} ${backgroundColor}`}
      role="alert"
    >
      <div className="flex">
        <div className="py-1">{icon}</div>
        <div>
          {title && <p className="font-bold">{title}</p>}
          <p className="text-xs">{children}</p>
        </div>
      </div>
    </div>
  )
}
