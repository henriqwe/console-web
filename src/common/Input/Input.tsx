import { ReactNode } from 'react'
import { DeepMap, FieldError, FieldValues } from 'react-hook-form'

type InputProps = {
  type?: string
  errors?: DeepMap<FieldValues, FieldError> & { message?: string }
  label?: string
  icon?: ReactNode
} & React.InputHTMLAttributes<HTMLInputElement>

export const Input = ({
  type = 'text',
  label,
  errors,
  icon,
  ...props
}: InputProps) => (
  <div className={`flex flex-col gap-2 ${props.className}`}>
    {label && (
      <label
        htmlFor={label}
        className="text-sm font-medium text-gray-700 dark:text-text-primary"
      >
        {label}
      </label>
    )}
    <div className="flex rounded-md">
      {icon && (
        <span className="inline-flex items-center px-3 text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 dark:bg-gray-800 dark:text-text-primary sm:text-sm dark:border-gray-600">
          {icon}
        </span>
      )}
      <input
        {...props}
        type={type}
        id={label}
        className={`pl-4 border border-gray-300 dark:border-gray-600 dark:bg-menu-primary  outline-1 outline-blue-300 dark:outline-blue-700 h-10 text-sm text-gray-700 dark:text-text-primary w-full dark:disabled:bg-menu-secondary disabled:bg-gray-300 disabled:cursor-not-allowed transition ${
          icon ? 'rounded-r-md' : 'rounded-md'
        }`}
      />
    </div>

    {errors && <p className="text-sm text-red-500">{errors.message}</p>}
  </div>
)
