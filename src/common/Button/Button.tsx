import * as common from 'common'
type ButtonProps = {
  children: React.ReactNode
  color?:
    | 'green'
    | 'blue'
    | 'yellow'
    | 'red'
    | 'green-outline'
    | 'blue-outline'
    | 'yellow-outline'
    | 'red-outline'
  loading?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const Button = ({
  children,
  color = 'blue',
  loading = false,
  className,
  ...props
}: ButtonProps) => {
  let buttonColor = ''
  let hoverButtonColor = ''
  let disableButtonColor = ''
  let textColor = ''
  switch (color) {
    case 'blue':
      buttonColor = 'bg-blue-500'
      hoverButtonColor = 'hover:bg-blue-600'
      disableButtonColor = 'disabled:bg-blue-400'
      textColor = 'text-white'
      break
    case 'green':
      buttonColor = 'bg-lime-400'
      hoverButtonColor = 'hover:bg-lime-500'
      disableButtonColor = 'disabled:bg-lime-600'
      textColor = 'text-gray-800'
      break
    case 'yellow':
      buttonColor = 'bg-yellow-300'
      hoverButtonColor = 'hover:bg-yellow-400'
      disableButtonColor = 'disabled:bg-yellow-200'
      textColor = 'text-gray-800'
      break
    case 'red':
      buttonColor = 'bg-red-500'
      hoverButtonColor = 'hover:bg-red-600'
      disableButtonColor = 'disabled:bg-red-400 '
      textColor = 'text-white'
      break
    case 'blue-outline':
      buttonColor = 'border-2 border-blue-500'
      hoverButtonColor = 'hover:bg-blue-600  hover:text-white'
      disableButtonColor = 'disabled:bg-blue-400'
      textColor = 'text-blue-500 '
      break
    case 'green-outline':
      buttonColor = 'border-2 border-lime-500'
      hoverButtonColor = 'hover:bg-lime-600  hover:text-white'
      disableButtonColor = 'disabled:bg-lime-400'
      textColor = 'text-lime-500'
      break
    case 'yellow-outline':
      buttonColor = 'border-2 border-yellow-500'
      hoverButtonColor = 'hover:bg-yellow-600  hover:text-white'
      disableButtonColor = 'disabled:bg-yellow-400'
      textColor = 'text-yellow-500 '
      break
    case 'red-outline':
      buttonColor = 'border-2 border-red-500'
      hoverButtonColor = 'hover:bg-red-600  hover:text-white'
      disableButtonColor = 'disabled:bg-red-400'
      textColor = 'text-red-500 '
      break
  }
  return (
    <button
      className={`px-4 py-2 transition ${buttonColor} ${hoverButtonColor} ${disableButtonColor} disabled:cursor-not-allowed rounded-md text-sm flex gap-2 items-center justify-center ${textColor} ${className}`}
      {...props}
    >
      {loading && <common.Spinner className="w-5 h-5" />}
      {children}
    </button>
  )
}
