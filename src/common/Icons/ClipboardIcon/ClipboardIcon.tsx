import { ClipboardIcon as Icon } from '@heroicons/react/outline'

export function ClipboardIcon({ ...props }: React.ComponentProps<'svg'>) {
  return (
    <Icon
      className={`w-5 h-5 ${props.className} dark:text-text-primary`}
      {...props}
    />
  )
}
