import { XIcon as XIconHeroicons } from '@heroicons/react/outline'

export function XIcon({ ...props }: React.ComponentProps<'svg'>) {
  return <XIconHeroicons className={`w-5 h-5 ${props.className}`} {...props} />
}
