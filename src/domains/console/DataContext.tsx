import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  Dispatch
} from 'react'
type DataContextProps = {
  currentTab: 'API' | 'DATA'
  setCurrentTab: Dispatch<SetStateAction<'API' | 'DATA'>>
}

type ProviderProps = {
  children: ReactNode
}

export const DataContext = createContext<DataContextProps>(
  {} as DataContextProps
)

export const DataProvider = ({ children }: ProviderProps) => {
  const [currentTab, setCurrentTab] = useState<'API' | 'DATA'>('API')

  return (
    <DataContext.Provider
      value={{
        currentTab,
        setCurrentTab
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  return useContext(DataContext)
}
