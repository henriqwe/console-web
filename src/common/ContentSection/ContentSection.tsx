import { ReactNode } from 'react'

type ContentSectionProps = {
  title: ReactNode
  children?: ReactNode
}

export function ContentSection({ title, children }: ContentSectionProps) {
  return (
    <div className="flex w-full h-full flex-col">
      <div className="flex items-center justify-between w-full px-4 h-12 bg-gray-200 rounded-t-lg">
        {title}
      </div>
      {children}
    </div>
  )
}
