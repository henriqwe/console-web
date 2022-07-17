import { BaseButton } from '../BaseButton'

type WhiteProps = {
  children: React.ReactNode
  loading?: boolean
  onClick?: () => void
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const White = ({
  loading = false,
  onClick,
  children,
  ...props
}: WhiteProps) => {
  return (
    <BaseButton
      onClick={onClick}
      loading={loading}
      disabled={loading}
      buttonColor="bg-white"
      hoverButtonColor="hover:bg-gray-50"
      disableButtonColor="disabled:bg-gray-200"
      textColor="text-gray-800"
      {...props}
    >
      {children}
    </BaseButton>
  )
}
