import { DeepMap, FieldError, FieldValues } from 'react-hook-form'

type InputProps = {
  type?: string
  errors?: DeepMap<FieldValues, FieldError> & { message?: string }
} & React.InputHTMLAttributes<HTMLInputElement>

export const Input = ({ type = 'text', errors, ...props }: InputProps) => (
  <div>
    <input
      {...props}
      type={type}
      className={`pl-4 border border-gray-300 rounded-md outline-1 outline-blue-300 h-10 text-sm text-gray-700 w-full ${props.className}`}
    />
    {errors && <p className="text-sm text-red-500">{errors.message}</p>}
  </div>
)
