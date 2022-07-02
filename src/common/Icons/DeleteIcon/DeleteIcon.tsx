import { TrashIcon } from '@heroicons/react/outline'

export function DeleteIcon({ ...props }: React.ComponentProps<'svg'>) {
  return (
    <TrashIcon
      className={`w-5 h-5 text-red-500 ${props.className}`}
      {...props}
    />
  )
}
