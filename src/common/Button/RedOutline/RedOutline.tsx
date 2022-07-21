import { BaseButton } from '../BaseButton'
import { ButtonProps } from '../type'

export const RedOutline = ({
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
      buttonColor="border-2 border-red-500"
      hoverButtonColor="hover:bg-red-600  hover:text-white"
      disableButtonColor="disabled:bg-red-400"
      textColor="text-red-500"
      iconPosition={iconPosition}
      icon={icon}
      {...props}
    >
      {children}
    </BaseButton>
  )
}
