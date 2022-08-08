import { PlayIcon as PlayIconHeroicons } from '@heroicons/react/outline'

export function PlayIcon({ ...props }: React.ComponentProps<'svg'>) {
  return (
    <PlayIconHeroicons
      className={`w-5 h-5 ${props.className} dark:text-text-primary`}
      {...props}
    />
  )
}
