import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  Dispatch
} from 'react'
import * as yup from 'yup'

type LoginContextProps = {
  formType: 'create' | 'login'
  setFormType: Dispatch<SetStateAction<'create' | 'login'>>
  logUserSchema: yup.AnyObjectSchema
  createUserSchema: yup.AnyObjectSchema
}

type ProviderProps = {
  children: ReactNode
}

export const LoginContext = createContext<LoginContextProps>(
  {} as LoginContextProps
)

export const LoginProvider = ({ children }: ProviderProps) => {
  const [formType, setFormType] = useState<'create' | 'login'>('login')

  const logUserSchema = yup.object().shape({
    userName: yup.string().required(),
    password: yup.string().required()
  })

  const createUserSchema = yup.object().shape({
    userName: yup.string().required(),
    email: yup.string().email().required(),
    password: yup
      .string()
      .required()
      .min(6, 'password must be at least 6 characters')
  })

  return (
    <LoginContext.Provider
      value={{
        formType,
        setFormType,
        logUserSchema,
        createUserSchema
      }}
    >
      {children}
    </LoginContext.Provider>
  )
}

export const useLogin = () => {
  return useContext(LoginContext)
}
