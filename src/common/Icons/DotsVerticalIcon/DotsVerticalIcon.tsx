import { DotsVerticalIcon as Icon } from '@heroicons/react/outline'

export function DotsVerticalIcon({ ...props }: React.ComponentProps<'svg'>) {
  return (
    <Icon
      className={`w-5 h-5 ${props.className} dark:text-text-primary`}
      {...props}
    />
  )
}
