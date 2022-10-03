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
  openSlide: boolean
  setOpenSlide: Dispatch<SetStateAction<boolean>>
  slideType: 'ACCOUNT' | 'ROLE' | 'UPDATEACCOUNT' | 'ADMINLOGIN'
  setSlideType: Dispatch<
    SetStateAction<'ACCOUNT' | 'ROLE' | 'UPDATEACCOUNT' | 'ADMINLOGIN'>
  >
  roleSchema: yup.AnyObjectSchema
  createUserSchema: yup.AnyObjectSchema
  selectedUser?: User
  setSelectedUser: Dispatch<SetStateAction<User | undefined>>
  roles?: { name: string }[]
  setRoles: Dispatch<SetStateAction<{ name: string }[] | undefined>>
  updateUserSchema: yup.AnyObjectSchema
}

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
  const [slideType, setSlideType] = useState<
    'ACCOUNT' | 'ROLE' | 'UPDATEACCOUNT'
  >('ACCOUNT')
  const [reload, setReload] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User>()
  const [roles, setRoles] = useState<{ name: string }[]>()
  const [currentTab, setCurrentTab] = useState<'ACCOUNT' | 'ROLE'>('ACCOUNT')

  const logUserSchema = yup.object().shape({
    userName: yup.string().required(),
    password: yup.string().required()
  })

  const roleSchema = yup.object().shape({
    Name: yup.string().required(),
    Active: yup.object().required(),
    Default: yup.object().required()
  })

  const createUserSchema = yup.object().shape({
    Username: yup.string().required(),
    Email: yup.string().email().required(),
    Password: yup.string().required()
  })

  const updateUserSchema = yup.object().shape({
    Email: yup.string().email().required(),
    Active: yup.object().required(),
    Roles: yup.array().min(1, 'Select at least one role').required()
  })

  return (
    <UserContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        reload,
        setReload,
        logUserSchema,
        openSlide,
        setOpenSlide,
        slideType,
        setSlideType,
        roleSchema,
        createUserSchema,
        selectedUser,
        setSelectedUser,
        roles,
        setRoles,
        updateUserSchema
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  return useContext(UserContext)
}
