import * as createProject from 'domains/createProject'
import { ReactNode } from 'react'

type TemplateProps = {
  children: ReactNode
}

export function Template({ children }: TemplateProps) {
  return (
    <div className="w-full h-[100vh] bg-gray-100 flex flex-col items-center">
      <createProject.Header />
      {children}
    </div>
  )
}
