import { DeepMap, FieldError, FieldValues } from 'react-hook-form'

type InputProps = {
  type?: string
  errors?: DeepMap<FieldValues, FieldError> & { message?: string }
  label?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export const Input = ({
  type = 'text',
  label,
  errors,
  ...props
}: InputProps) => (
  <div className="flex flex-col gap-2">
    {label && (
      <label
        htmlFor={label}
        className="text-sm font-medium text-gray-700 dark:text-text-primary"
      >
        {label}
      </label>
    )}
    <input
      {...props}
      type={type}
      id={label}
      className={`pl-4 border border-gray-300 dark:border-gray-600 dark:bg-menu-primary rounded-md outline-1 outline-blue-300 dark:outline-blue-700 h-10 text-sm text-gray-700 dark:text-text-primary w-full disabled:bg-gray-300 disabled:cursor-not-allowed transition ${props.className}`}
    />
    {errors && <p className="text-sm text-red-500">{errors.message}</p>}
  </div>
)
