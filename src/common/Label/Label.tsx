import { DeepMap, FieldError, FieldValues } from 'react-hook-form'

type LabelProps = {
  text?: string
  size?: 'small' | 'medium' | 'large'
}

export const Label = ({ text = 'Default Text', size }: LabelProps) => {
  let className = ''
  switch (size) {
    case 'small':
      className += 'px-2.5 py-0.5 text-xs'
      break
    case 'large':
      className += 'px-[15px] py-1 text-base'
      break
    default:
    case 'medium':
      className += 'px-3 py-[.18rem] text-sm'
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium bg-gray-200 dark:bg-menuItem-primary dark:text-text-primary ${className}`}
    >
      <svg
        className="-ml-1 mr-1.5 h-2 w-2 text-gray-500 dark:text-text-secondary"
        fill="currentColor"
        viewBox="0 0 8 8"
      >
        <circle cx={4} cy={4} r={3} />
      </svg>
      {text}
    </span>
  )
}
