import * as common from 'common'
type BaseButtonProps = {
  children: React.ReactNode
  buttonColor: string
  hoverButtonColor: string
  disableButtonColor: string
  textColor: string
  loading?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const BaseButton = ({
  children,
  loading = false,
  className,
  buttonColor,
  hoverButtonColor,
  disableButtonColor,
  textColor,
  ...props
}: BaseButtonProps) => {
  return (
    <button
      className={` px-2.5 py-1.5 text-xs transition ${buttonColor} ${hoverButtonColor} ${disableButtonColor} disabled:cursor-not-allowed hover:cursor-pointer rounded-md flex gap-2 items-center justify-center ${textColor} `}
      {...props}
    >
      {loading && <common.Spinner className="w-5 h-5" />}
      {children}
    </button>
  )
}
