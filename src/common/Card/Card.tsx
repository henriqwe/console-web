import { ReactNode } from 'react'

type CardType = {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardType) {
  return (
    <div className={`dark:text-text-primary w-full rounded-lg ${className}`}>
      {children}
    </div>
  )
}
