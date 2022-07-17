import { BaseButton } from '../BaseButton'

type GreenOutlineProps = {
  children: React.ReactNode
  loading?: boolean
  onClick?: () => void
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const GreenOutline = ({
  loading = false,
  onClick,
  children,
  ...props
}: GreenOutlineProps) => {
  return (
    <BaseButton
      onClick={onClick}
      loading={loading}
      disabled={loading}
      buttonColor="border-2 border-lime-500"
      hoverButtonColor="hover:bg-lime-600  hover:text-white"
      disableButtonColor="disabled:bg-lime-400"
      textColor="text-lime-500"
      {...props}
    >
      {children}
    </BaseButton>
  )
}
