import { Icon } from '@iconify/react'

export function CodeSquareIcon({ ...props }: React.ComponentProps<'svg'>) {
  return (
    <Icon
      icon="bi:code-square"
      className={`w-5 h-5 ${props.className} dark:text-text-primary`}
    />
  )
}
