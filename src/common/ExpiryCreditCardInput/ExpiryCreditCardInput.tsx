import InputMask from 'react-input-mask'
import { Control, Controller } from 'react-hook-form'
import * as common from 'common'
import { DeepMap, FieldError, FieldValues } from 'react-hook-form'
import { ReactNode } from 'react'

type ExpiryCreditCardInputProps = {
  control: Control<FieldValues>
  error?: DeepMap<FieldValues, FieldError>
  className?: string
  disabled?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
} & React.InputHTMLAttributes<HTMLInputElement>

export function ExpiryCreditCardInput({
  control,
  error,
  disabled = false,
  ...rest
}: ExpiryCreditCardInputProps) {
  return (
    <Controller
      name="expiry"
      control={control}
      render={({ field: { onChange, value } }) => (
        <InputMask
          mask="99/99"
          placeholder="00/00"
          onChange={onChange}
          disabled={disabled}
          value={value}
        >
          <common.Input
            label="Expiry"
            placeholder="Expiry"
            errors={error}
            value={value}
            {...rest}
          />
        </InputMask>
      )}
    />
  )
}
