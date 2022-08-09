import { ReactNode } from 'react'

type ContentSectionProps = {
  title?: ReactNode
  children?: ReactNode
  noMargin?: boolean
  variant?: 'normal' | 'WithoutTitleBackgroundColor'
}

export function ContentSection({
  title,
  children,
  noMargin = false,
  variant = 'normal'
}: ContentSectionProps) {
  return (
    <div className="flex flex-col w-full h-full">
      {title && <div
        className={`flex items-center justify-between w-full ${
          noMargin ? '' : 'px-4'
        }  h-12 rounded-t-lg dark:text-text-primary ${
          variant === 'normal' ? '' : ''
        }`}
      >
        {title}
      </div>}
      <div className="h-full overflow-y-auto dark:text-text-primary">
        {children}
      </div>
    </div>
  )
}
