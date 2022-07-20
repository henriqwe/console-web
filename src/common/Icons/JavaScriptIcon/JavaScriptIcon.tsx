import { Icon } from '@iconify/react'

export function JavaScriptIcon({ ...props }: React.ComponentProps<'svg'>) {
  return (
    <Icon
      icon="fa6-brands:js-square"
      className={`w-5 h-5 ${props.className}`}
    />
  )
}
