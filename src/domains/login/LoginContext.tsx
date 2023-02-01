import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  Dispatch
} from 'react'

type LoginContextProps = {
  formType: 'create' | 'login'
  setFormType: Dispatch<SetStateAction<'create' | 'login'>>
}

type ProviderProps = {
  children: ReactNode
}

export const LoginContext = createContext<LoginContextProps>(
  {} as LoginContextProps
)

export const LoginProvider = ({ children }: ProviderProps) => {
  const [formType, setFormType] = useState<'create' | 'login'>('login')

  return (
    <LoginContext.Provider
      value={{
        formType,
        setFormType
      }}
    >
      {children}
    </LoginContext.Provider>
  )
}

export const useLogin = () => {
  return useContext(LoginContext)
}
