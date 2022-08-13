import { DownloadIcon as Icon } from '@heroicons/react/outline'

export function DownloadIcon({ ...props }: React.ComponentProps<'svg'>) {
  return <Icon className={`w-5 h-5 ${props.className}`} {...props} />
}
