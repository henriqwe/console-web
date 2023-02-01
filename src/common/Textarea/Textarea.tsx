import { ReactNode, TextareaHTMLAttributes } from 'react'
import { DeepMap, FieldError, FieldValues } from 'react-hook-form'

type TextareaProps = {
  type?: string
  errors?: DeepMap<FieldValues, FieldError> & { message?: string }
  label?: string
  icon?: ReactNode
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = ({
  type = 'text',
  label,
  errors,
  icon,
  ...props
}: TextareaProps) => (
  <div className="flex w-full flex-col gap-2">
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
      <textarea
        {...props}
        id={props?.id ?? label}
        data-testid={props?.id ?? label}
        className={`p-2 border resize-none border-gray-300 dark:border-gray-600 dark:bg-menu-primary outline-1 outline-blue-300 dark:outline-blue-700  text-sm text-gray-700 dark:text-text-primary w-full dark:disabled:bg-menu-secondary disabled:bg-gray-300 disabled:cursor-not-allowed transition ${
          icon ? 'rounded-r-md' : 'rounded-md'
        } ${props.className}`}
      />
    </div>

    {errors && <p className="text-sm text-red-500">{errors.message}</p>}
  </div>
)
