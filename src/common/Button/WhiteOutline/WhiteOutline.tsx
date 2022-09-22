import { BaseButton } from '../BaseButton'
import { ButtonProps } from '../type'

export const WhiteOutline = ({
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
      buttonColor="border-2 border-gray-300"
      hoverButtonColor="hover:bg-gray-50"
      disableButtonColor="disabled:bg-gray-200"
      textColor="text-gray-800 dark:hover:text-gray-800 dark:text-white"
      iconPosition={iconPosition}
      icon={icon}
      type={type}
      {...props}
    >
      {children}
    </BaseButton>
  )
}
