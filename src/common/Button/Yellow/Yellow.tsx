import { BaseButton } from '../BaseButton'
import { ButtonProps } from '../type'

export const Yellow = ({
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
      buttonColor="bg-yellow-300"
      hoverButtonColor="hover:bg-yellow-400"
      disableButtonColor="disabled:bg-yellow-200"
      textColor="text-gray-800"
      iconPosition={iconPosition}
      icon={icon}
      {...props}
    >
      {children}
    </BaseButton>
  )
}
