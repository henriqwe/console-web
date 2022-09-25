import { SearchIcon } from '@heroicons/react/outline'

export const ViewIcon = ({ ...props }: React.ComponentProps<'svg'>) => (
  <SearchIcon
    {...props}
    className={`w-5 h-5 dark:text-white text-black ${props.className}`}
  />
)
