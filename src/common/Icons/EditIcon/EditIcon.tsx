import { PencilIcon } from '@heroicons/react/outline'

export function EditIcon({ ...props }: React.ComponentProps<'svg'>) {
  return (
    <PencilIcon
      className={`w-5 h-5 text-cyan-900 ${props.className}`}
      {...props}
    />
  )
}
