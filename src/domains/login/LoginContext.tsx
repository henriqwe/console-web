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
    userName: yup
      .string()
      .required('Preencha o nome de usuário para continuar'),
    password: yup.string().required('Preencha a senha para continuar')
  })

  const createUserSchema = yup.object().shape({
    userName: yup
      .string()
      .required('Preencha o nome de usuário para continuar'),
    email: yup
      .string()
      .email('Digite um email válido')
      .required('Preencha o email para continuar'),
    password: yup.string().required('Preencha a senha para continuar')
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
