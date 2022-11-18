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

  const logUserSchema = yup.object().shape({
    userName: yup
      .string()
      .required('This field is required')
      .test('equal', 'This field cannot contain spaces', (val) => {
        const validation = new RegExp(/\s/g)
        return !validation.test(val as string)
      })
      .test('equal', 'This field must contain only letters', (val) => {
        const validation = new RegExp(/^[A-Za-z ]*$/)
        return validation.test(val as string)
      }),
    password: yup.string().required('This field is required')
  })

  const createUserSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    userName: yup
      .string()
      .required('Username is required')
      .test('equal', 'This field cannot contain spaces', (val) => {
        const validation = new RegExp(/\s/g)
        return !validation.test(val as string)
      })
      .test('equal', 'This field must contain only letters', (val) => {
        const validation = new RegExp(/^[A-Za-z ]*$/)
        return validation.test(val as string)
      }),
    email: yup
      .string()
      .email('Email must be valid')
      .required('This field is required'),
    password: yup
      .string()
      .required()
      .min(6, 'Password must be at least 6 characters long')
  })

  const changePasswordSchema = (step: number) => {
    let yupObject = {}

    if (step === 0) {
      yupObject = {
        userName: yup.string().required('This field is required')
      }
    }

    if (step !== 0) {
      yupObject = {
        email: yup.string().email().required(),
        password: yup
          .string()
          .required()
          .min(6, 'password must be at least 6 characters')
      }
    }

    return yup.object().shape(yupObject)
  }

  return (
    <LoginContext.Provider
      value={{
        formType,
        setFormType,
        logUserSchema,
        createUserSchema,
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
