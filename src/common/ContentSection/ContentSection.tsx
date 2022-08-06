import { ReactNode } from 'react'

type ContentSectionProps = {
  title: ReactNode
  children?: ReactNode
  variant?: 'normal' | 'WithoutTitleBackgroundColor'
}

export function ContentSection({
  title,
  children,
  variant = 'normal'
}: ContentSectionProps) {
  return (
    <div className="flex w-full h-full flex-col">
      <div
        className={`flex items-center justify-between w-full px-4 h-12 rounded-t-lg dark:text-gray-200 ${
          variant === 'normal' ? 'bg-gray-200 dark:bg-gray-800' : ''
        }`}
      >
        {title}
      </div>
      {children}
    </div>
  )
}
