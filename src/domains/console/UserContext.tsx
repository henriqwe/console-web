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
  slideType: 'ACCOUNT' | 'ROLE'
  setSlideType: Dispatch<SetStateAction<'ACCOUNT' | 'ROLE'>>
  roleSchema: yup.AnyObjectSchema
}

type ProviderProps = {
  children: ReactNode
}

export const UserContext = createContext<UserContextProps>(
  {} as UserContextProps
)

export const UserProvider = ({ children }: ProviderProps) => {
  const [openSlide, setOpenSlide] = useState(false)
  const [slideType, setSlideType] = useState<'ACCOUNT' | 'ROLE'>('ACCOUNT')
  const [reload, setReload] = useState(false)
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
        roleSchema
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  return useContext(UserContext)
}
