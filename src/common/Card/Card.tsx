import { ReactNode } from 'react'

type CardType = {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardType) {
  return (
    <div className={`w-full rounded-lg bg-blue-700 ${className}`}>
      {children}
    </div>
  )
}
