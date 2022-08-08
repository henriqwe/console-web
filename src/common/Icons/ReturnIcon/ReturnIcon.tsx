import { Icon } from '@iconify/react'

export function ReturnIcon({ className }: { className?: string }) {
  return (
    <Icon
      icon="icon-park-outline:return"
      className={`${className} dark:text-text-primary`}
    />
  )
}
