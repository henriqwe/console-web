import * as plans from 'domains/plans'
import { ReactNode } from 'react'

type TemplateProps = {
  children: ReactNode
}

export function Template({ children }: TemplateProps) {
  return (
    <div className="w-full h-[100vh] bg-gray-100 flex flex-col items-center">
      <plans.Header />

      {children}
    </div>
  )
}
