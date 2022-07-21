import { BaseButton } from '../BaseButton'
import { ButtonProps } from '../type'

export const Red = ({
  loading = false,
  onClick,
  children,
  iconPosition,
  icon,
  ...props
}: ButtonProps) => {
  return (
    <BaseButton
      onClick={onClick}
      loading={loading}
      disabled={loading}
      buttonColor="bg-red-500"
      hoverButtonColor="hover:bg-red-600"
      disableButtonColor="disabled:bg-red-400 "
      textColor="text-white"
      iconPosition={iconPosition}
      icon={icon}
      {...props}
    >
      {children}
    </BaseButton>
  )
}
