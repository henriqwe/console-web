import * as common from 'common'
import { BaseButtonProps } from '../type'

export const BaseButton = ({
  children,
  loading = false,
  className,
  buttonColor,
  hoverButtonColor,
  disableButtonColor,
  textColor = 'dark:text-text-primary',
  iconPosition = 'right',
  icon,
  type = 'button',
  ...props
}: BaseButtonProps) => {
  return (
    <button
      className={`border px-2 py-2 text-xs transition ${buttonColor} ${hoverButtonColor} ${disableButtonColor} disabled:cursor-not-allowed hover:cursor-pointer rounded-md flex gap-2 items-center justify-center ${textColor} ${
        iconPosition === 'right' ? 'flex-row-reverse' : ''
      }`}
      {...props}
    >
      {loading ? <common.Spinner className="w-5 h-5" /> : icon ?? null}
      {children}
    </button>
  )
}
