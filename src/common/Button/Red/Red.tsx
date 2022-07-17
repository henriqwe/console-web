import { BaseButton } from '../BaseButton'

type RedProps = {
  children: React.ReactNode
  loading?: boolean
  onClick?: () => void
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const Red = ({
  loading = false,
  onClick,
  children,
  ...props
}: RedProps) => {
  return (
    <BaseButton
      onClick={onClick}
      loading={loading}
      disabled={loading}
      buttonColor="bg-red-500"
      hoverButtonColor="hover:bg-red-600"
      disableButtonColor="disabled:bg-red-400 "
      textColor="text-white"
      {...props}
    >
      {children}
    </BaseButton>
  )
}
