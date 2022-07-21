import { BaseButton } from '../BaseButton'
import { ButtonProps } from '../type'

export const Green = ({
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
      buttonColor="bg-lime-400"
      hoverButtonColor="hover:bg-lime-500"
      disableButtonColor="disabled:bg-lime-600"
      textColor="text-gray-800"
      iconPosition={iconPosition}
      icon={icon}
      {...props}
    >
      {children}
    </BaseButton>
  )
}
