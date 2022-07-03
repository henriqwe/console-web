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
  <div className="flex flex-col gap-1">
    {label && (
      <label htmlFor={label} className="text-gray-700">
        {label}
      </label>
    )}
    <input
      {...props}
      type={type}
      id={label}
      className={`pl-4 border border-gray-300 rounded-md outline-1 outline-blue-300 h-10 text-sm text-gray-700 w-full disabled:bg-gray-300 disabled:cursor-not-allowed transition ${props.className}`}
    />
    {errors && <p className="text-sm text-red-500">{errors.message}</p>}
  </div>
)
