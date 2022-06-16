import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  Dispatch
} from 'react'
type UsersContextProps = {
  selectedItem?: SelectedItem
  setSelectedItem: Dispatch<SetStateAction<SelectedItem | undefined>>
}

type SelectedItem = {
  type: 'schema' | 'table'
  name: string
  location: string
  id: string
}

type ProviderProps = {
  children: ReactNode
}

export const UsersContext = createContext<UsersContextProps>(
  {} as UsersContextProps
)

export const UsersProvider = ({ children }: ProviderProps) => {
  const [selectedItem, setSelectedItem] = useState<{
    type: 'schema' | 'table'
    name: string
    location: string
    id: string
  }>()

  return (
    <UsersContext.Provider
      value={{
        selectedItem,
        setSelectedItem
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}

export const useUsers = () => {
  return useContext(UsersContext)
}
