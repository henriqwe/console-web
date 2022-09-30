import { BaseButton } from '../BaseButton'
import { ButtonProps } from '../type'

export const Ycodify = ({
  loading = false,
  onClick,
  children,
  iconPosition,
  icon,
  type,
  className,
  ...props
}: ButtonProps) => {
  return (
    <BaseButton
      onClick={onClick}
      loading={loading}
      disabled={loading}
      buttonColor="bg-ycodify"
      hoverButtonColor="hover:bg-ycodify/90"
      disableButtonColor="disabled:bg-ycodify/70"
      textColor="text-text-primary"
      iconPosition={iconPosition}
      icon={icon}
      type={type}
      className={className}
      {...props}
    >
      {children}
    </BaseButton>
  )
}
