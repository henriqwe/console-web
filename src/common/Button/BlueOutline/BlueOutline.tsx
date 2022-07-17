import { BaseButton } from '../BaseButton'

type BlueOutlineProps = {
  children: React.ReactNode
  loading?: boolean
  onClick?: () => void
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const BlueOutline = ({
  loading = false,
  onClick,
  children,
  ...props
}: BlueOutlineProps) => {
  return (
    <BaseButton
      onClick={onClick}
      loading={loading}
      disabled={loading}
      buttonColor="border-2 border-blue-500"
      hoverButtonColor="hover:bg-blue-600  hover:text-white"
      disableButtonColor="disabled:bg-blue-400"
      textColor="text-blue-500 "
      {...props}
    >
      {children}
    </BaseButton>
  )
}
