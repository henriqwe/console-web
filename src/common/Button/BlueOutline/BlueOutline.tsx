import { BaseButton } from '../BaseButton'
import { ButtonProps } from '../type'

export const BlueOutline = ({
  loading = false,
  onClick,
  children,
  iconPosition,
  icon,
  type,
  ...props
}: ButtonProps) => {
  return (
    <BaseButton
      onClick={onClick}
      loading={loading}
      disabled={loading}
      buttonColor="border-2 border-blue-500"
      hoverButtonColor="hover:bg-blue-600  hover:text-white"
      disableButtonColor="disabled:bg-blue-400"
      textColor="text-blue-500"
      iconPosition={iconPosition}
      icon={icon}
      type={type}
      {...props}
    >
      {children}
    </BaseButton>
  )
}
