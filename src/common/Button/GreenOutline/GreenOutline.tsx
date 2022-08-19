import { BaseButton } from '../BaseButton'
import { ButtonProps } from '../type'

export const GreenOutline = ({
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
      buttonColor="border-2 border-lime-500"
      hoverButtonColor="hover:bg-lime-600  hover:text-white"
      disableButtonColor="disabled:bg-lime-400"
      textColor="text-lime-500"
      iconPosition={iconPosition}
      icon={icon}
      type={type}
      {...props}
    >
      {children}
    </BaseButton>
  )
}
