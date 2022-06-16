type ButtonProps = {
  children: React.ReactNode
  color?: 'green' | 'blue' | 'yellow' | 'red'
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const Button = ({ children, color = 'blue', ...props }: ButtonProps) => {
  let buttonColor = ''
  let hoverButtonColor = ''
  let textColor = ''
  switch (color) {
    case 'blue':
      buttonColor = 'bg-blue-500'
      hoverButtonColor = 'hover:bg-blue-700'
      textColor = 'text-white'
      break
    case 'green':
      buttonColor = 'bg-green-300'
      hoverButtonColor = 'hover:bg-green-500'
      textColor = 'text-gray-800'
      break
    case 'yellow':
      buttonColor = 'bg-yellow-300'
      hoverButtonColor = 'hover:bg-yellow-500'
      textColor = 'text-gray-800'
      break
    case 'red':
      buttonColor = 'bg-red-500'
      hoverButtonColor = 'hover:bg-red-700'
      textColor = 'text-white'
      break
  }
  return (
    <button
      className={`px-4 py-2 ${buttonColor} ${hoverButtonColor} rounded-md text-sm ${textColor} ${props.className}`}
      {...props}
    >
      {children}
    </button>
  )
}
