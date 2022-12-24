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
  changePasswordSchema: (step: number) => yup.AnyObjectSchema
}

type ProviderProps = {
  children: ReactNode
}

export const LoginContext = createContext<LoginContextProps>(
  {} as LoginContextProps
)

export const LoginProvider = ({ children }: ProviderProps) => {
  const [formType, setFormType] = useState<'create' | 'login'>('login')

  const changePasswordSchema = (step: number) => {
    let yupObject = {}

    if (step === 0) {
      yupObject = {
        userName: yup.string().required('Username is required')
      }
    }

    if (step !== 0) {
      yupObject = {
        userName: yup.string().required('Username is required'),
        password: yup
          .string()
          .required('Password is required')
          .min(6, 'Password must be at least 6 characters'),
        recoverHash: yup.string().required('Recover Hash is required')
      }
    }

    return yup.object().shape(yupObject)
  }

  return (
    <LoginContext.Provider
      value={{
        formType,
        setFormType,
        changePasswordSchema
      }}
    >
      {children}
    </LoginContext.Provider>
  )
}

export const useLogin = () => {
  return useContext(LoginContext)
}
