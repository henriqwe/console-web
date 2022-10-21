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
      buttonColor="bg-yc"
      hoverButtonColor="hover:bg-yc/90"
      disableButtonColor="disabled:bg-yc/70"
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
