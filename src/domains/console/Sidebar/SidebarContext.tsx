import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  Dispatch
} from 'react'

import { DatabaseIcon } from '@heroicons/react/outline'
import type { currentTabType } from 'domains/console/SchemaManagerContext'

type SidebarContextProps = {
  selectedTab: {
    name: currentTabType
    icon?: any
  }
  setSelectedTab: Dispatch<
    SetStateAction<{
      name: currentTabType
      icon?: any
    }>
  >
}

type ProviderProps = {
  children: ReactNode
}

export const SidebarContext = createContext<SidebarContextProps>(
  {} as SidebarContextProps
)

export const SidebarProvider = ({ children }: ProviderProps) => {
  const [selectedTab, setSelectedTab] = useState<{
    name: currentTabType
    icon?: any
  }>({
    name: 'Schema',
    icon: DatabaseIcon
  })

  return (
    <SidebarContext.Provider value={{ selectedTab, setSelectedTab }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  return useContext(SidebarContext)
}
