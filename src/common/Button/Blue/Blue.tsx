import { BaseButton } from '../BaseButton'
import { ButtonProps } from '../type'

export const Blue = ({
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
      buttonColor="bg-blue-500"
      hoverButtonColor="hover:bg-blue-600"
      disableButtonColor="disabled:bg-blue-400"
      textColor="text-white"
      iconPosition={iconPosition}
      icon={icon}
      {...props}
    >
      {children}
    </BaseButton>
  )
}
