import { BaseButton } from '../BaseButton'
import { ButtonProps } from '../type'

export const Clean = ({
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
      buttonColor=""
      hoverButtonColor=""
      disableButtonColor=""
      textColor=""
      iconPosition={iconPosition}
      icon={icon}
      {...props}
    >
      {children}
    </BaseButton>
  )
}
