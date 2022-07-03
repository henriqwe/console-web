import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  Dispatch
} from 'react'

import { DatabaseIcon } from '@heroicons/react/outline'

type SidebarContextProps = {
  selectedTab: {
    name: string
    icon?: any
  }
  setSelectedTab: Dispatch<
    SetStateAction<{
      name: string
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
  const [selectedTab, setSelectedTab] = useState<{ name: string; icon?: any }>({
    name: 'CONSOLE',
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
