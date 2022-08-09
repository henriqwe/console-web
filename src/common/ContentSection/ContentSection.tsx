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
        className={`flex items-center justify-between w-full px-2 h-12 rounded-t-lg dark:text-text-primary ${
          variant === 'normal' ? 'bg-gray-200 dark:bg-menu-primary' : ''
        }`}
      >
        {title}
      </div>
      <div className="dark:text-text-primary h-full overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
