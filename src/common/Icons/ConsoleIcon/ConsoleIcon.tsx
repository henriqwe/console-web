import { Icon } from '@iconify/react'

export function ConsoleIcon({ className }: { className?: string }) {
  return (
    <Icon
      icon="fluent:window-console-20-filled"
      className={`w-5 h-5 ${className}`}
    />
  )
}
