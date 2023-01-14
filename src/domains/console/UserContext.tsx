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
  openSlide: boolean
  setOpenSlide: Dispatch<SetStateAction<boolean>>
  slideType: slideTypeTypes
  setSlideType: Dispatch<SetStateAction<slideTypeTypes>>
  selectedUser?: User
  setSelectedUser: Dispatch<SetStateAction<User | undefined>>
  roles?: { name: string }[]
  setRoles: Dispatch<SetStateAction<{ name: string }[] | undefined>>
  slideData: any
  setSlideData: Dispatch<any>
}
type slideTypeTypes =
  | 'ACCOUNT'
  | 'ROLE'
  | 'UPDATEROLE'
  | 'UPDATEACCOUNT'
  | 'ADMINLOGIN'
  | 'ASSOCIATEACCOUNT'

type User = {
  createdAt: number
  email: string
  id: string
  name?: string
  oldPassword?: string
  password: string
  roles: { name: string }[]
  status: 0 | 1
  updatedAt?: number
  username: string
  version: number
}

type ProviderProps = {
  children: ReactNode
}

export const UserContext = createContext<UserContextProps>(
  {} as UserContextProps
)

export const UserProvider = ({ children }: ProviderProps) => {
  const [openSlide, setOpenSlide] = useState(false)
  const [slideType, setSlideType] = useState<slideTypeTypes>('ACCOUNT')
  const [slideData, setSlideData] = useState<any>()

  const [reload, setReload] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User>()
  const [roles, setRoles] = useState<{ name: string }[]>()
  const [currentTab, setCurrentTab] = useState<'ACCOUNT' | 'ROLE'>('ACCOUNT')

  return (
    <UserContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        reload,
        setReload,
        openSlide,
        setOpenSlide,
        slideType,
        setSlideType,
        selectedUser,
        setSelectedUser,
        roles,
        setRoles,
        slideData,
        setSlideData
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  return useContext(UserContext)
}
