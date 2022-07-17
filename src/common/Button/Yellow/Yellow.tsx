import { BaseButton } from '../BaseButton'

type YellowProps = {
  children: React.ReactNode
  loading?: boolean
  onClick?: () => void
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const Yellow = ({
  loading = false,
  onClick,
  children,
  ...props
}: YellowProps) => {
  return (
    <BaseButton
      onClick={onClick}
      loading={loading}
      disabled={loading}
      buttonColor="bg-yellow-300"
      hoverButtonColor="hover:bg-yellow-400"
      disableButtonColor="disabled:bg-yellow-200"
      textColor="text-gray-800"
      {...props}
    >
      {children}
    </BaseButton>
  )
}
