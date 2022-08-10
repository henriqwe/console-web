import { BaseButton } from '../BaseButton'
import { ButtonProps } from '../type'

export const White = ({
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
      buttonColor="bg-white"
      hoverButtonColor="hover:bg-gray-50"
      disableButtonColor="disabled:bg-gray-200"
      textColor="text-gray-800 dark:text-gray-800"
      iconPosition={iconPosition}
      icon={icon}
      {...props}
    >
      {children}
    </BaseButton>
  )
}
