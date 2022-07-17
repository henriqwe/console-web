import { BaseButton } from '../BaseButton'

type YellowOutlineProps = {
  children: React.ReactNode
  loading?: boolean
  onClick?: () => void
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const YellowOutline = ({
  loading = false,
  onClick,
  children,
  ...props
}: YellowOutlineProps) => {
  return (
    <BaseButton
      onClick={onClick}
      loading={loading}
      disabled={loading}
      buttonColor="border-2 border-yellow-500"
      hoverButtonColor="hover:bg-yellow-600  hover:text-white"
      disableButtonColor="disabled:bg-yellow-400"
      textColor="text-yellow-500 "
      {...props}
    >
      {children}
    </BaseButton>
  )
}
