import { BaseButton } from '../BaseButton'

type BlueProps = {
  children: React.ReactNode
  loading?: boolean
  onClick?: () => void
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const Blue = ({
  loading = false,
  onClick,
  children,
  ...props
}: BlueProps) => {
  return (
    <BaseButton
      onClick={onClick}
      loading={loading}
      disabled={loading}
      buttonColor="bg-blue-500"
      hoverButtonColor="hover:bg-blue-600"
      disableButtonColor="disabled:bg-blue-400"
      textColor="text-white"
      {...props}
    >
      {children}
    </BaseButton>
  )
}
