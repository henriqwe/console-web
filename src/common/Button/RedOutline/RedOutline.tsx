import { BaseButton } from '../BaseButton'

type RedOutlineProps = {
  children: React.ReactNode
  loading?: boolean
  onClick?: () => void
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const RedOutline = ({
  loading = false,
  onClick,
  children,
  ...props
}: RedOutlineProps) => {
  return (
    <BaseButton
      onClick={onClick}
      loading={loading}
      disabled={loading}
      buttonColor="border-2 border-red-500"
      hoverButtonColor="hover:bg-red-600  hover:text-white"
      disableButtonColor="disabled:bg-red-400"
      textColor="text-red-500 "
      {...props}
    >
      {children}
    </BaseButton>
  )
}
