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
  selectedTable?: string
  setSelectedTable: Dispatch<SetStateAction<string | undefined>>
}

type ProviderProps = {
  children: ReactNode
}

export const DataContext = createContext<DataContextProps>(
  {} as DataContextProps
)

export const DataProvider = ({ children }: ProviderProps) => {
  const [currentTab, setCurrentTab] = useState<'API' | 'DATA'>('API')
  const [selectedTable, setSelectedTable] = useState<string>()

  return (
    <DataContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        selectedTable,
        setSelectedTable
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  return useContext(DataContext)
}
