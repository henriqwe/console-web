import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  Dispatch
} from 'react'
import * as yup from 'yup'

type DataContextProps = {
  currentTab: 'CONSOLE' | 'DATA'
  setCurrentTab: Dispatch<SetStateAction<'CONSOLE' | 'DATA'>>
  selectedTable?: string
  setSelectedTable: Dispatch<SetStateAction<string | undefined>>
  reload: boolean
  setReload: Dispatch<SetStateAction<boolean>>
  fieldSchema: yup.AnyObjectSchema
}

type ProviderProps = {
  children: ReactNode
}

export const DataContext = createContext<DataContextProps>(
  {} as DataContextProps
)

export const DataProvider = ({ children }: ProviderProps) => {
  const [reload, setReload] = useState(false)
  const [currentTab, setCurrentTab] = useState<'CONSOLE' | 'DATA'>('CONSOLE')
  const [selectedTable, setSelectedTable] = useState<string>()

  const fieldSchema = yup.object().shape({
    // Name: yup.string().required(),
    Type: yup.object().required(),
    Nullable: yup.object().required(),
    Unique: yup.object().required(),
    Index: yup.object().required(),
    Comment: yup.string().required()
  })

  return (
    <DataContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        selectedTable,
        setSelectedTable,
        reload,
        setReload,
        fieldSchema
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  return useContext(DataContext)
}
