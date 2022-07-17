import { BaseButton } from '../BaseButton'

type GreenProps = {
  children: React.ReactNode
  loading?: boolean
  onClick?: () => void
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const Green = ({
  loading = false,
  onClick,
  children,
  ...props
}: GreenProps) => {
  return (
    <BaseButton
      onClick={onClick}
      loading={loading}
      disabled={loading}
      buttonColor="bg-lime-400"
      hoverButtonColor="hover:bg-lime-500"
      disableButtonColor="disabled:bg-lime-600"
      textColor="text-gray-800"
      {...props}
    >
      {children}
    </BaseButton>
  )
}
