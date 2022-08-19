import { BaseButton } from '../BaseButton'
import { ButtonProps } from '../type'

export const Clean = ({
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
      buttonColor=""
      hoverButtonColor=""
      disableButtonColor=""
      textColor=""
      iconPosition={iconPosition}
      icon={icon}
      type={type}
      {...props}
    >
      {children}
    </BaseButton>
  )
}
