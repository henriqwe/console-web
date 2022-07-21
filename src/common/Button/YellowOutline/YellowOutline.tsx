import { BaseButton } from '../BaseButton'
import { ButtonProps } from '../type'

export const YellowOutline = ({
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
      buttonColor="border-2 border-yellow-500"
      hoverButtonColor="hover:bg-yellow-600  hover:text-white"
      disableButtonColor="disabled:bg-yellow-400"
      textColor="text-yellow-500"
      iconPosition={iconPosition}
      icon={icon}
      {...props}
    >
      {children}
    </BaseButton>
  )
}
