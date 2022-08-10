import { ReactNode } from 'react'

type ContentSectionProps = {
  title?: ReactNode
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
      {title && (
        <div
          className={`flex items-center justify-between w-full h-[3.3rem] rounded-t-lg dark:text-text-primary ${
            variant === 'normal' ? 'bg-gray-200 dark:bg-menu-primary' : ''
          }`}
        >
          {title}
        </div>
      )}
      <div className="h-full overflow-y-auto dark:text-text-primary">
        {children}
      </div>
    </div>
  )
}
