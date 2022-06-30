import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  Dispatch
} from 'react'
import * as yup from 'yup'

type UserContextProps = {
  currentTab: 'ACCOUNT' | 'ROLE'
  setCurrentTab: Dispatch<SetStateAction<'ACCOUNT' | 'ROLE'>>
  reload: boolean
  setReload: Dispatch<SetStateAction<boolean>>
  logUserSchema: yup.AnyObjectSchema
}

type ProviderProps = {
  children: ReactNode
}

export const UserContext = createContext<UserContextProps>(
  {} as UserContextProps
)

export const UserProvider = ({ children }: ProviderProps) => {
  const [reload, setReload] = useState(false)
  const [currentTab, setCurrentTab] = useState<'ACCOUNT' | 'ROLE'>('ACCOUNT')

  const logUserSchema = yup.object().shape({
    userName: yup.string().required(),
    password: yup.string().required()
  })

  return (
    <UserContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        reload,
        setReload,
        logUserSchema
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  return useContext(UserContext)
}
