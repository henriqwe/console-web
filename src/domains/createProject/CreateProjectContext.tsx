import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  Dispatch
} from 'react'
import * as yup from 'yup'
import * as types from 'domains/console/types'

type CreateProjectContextProps = {
  currentPage: 'PLANS' | 'FORM' | 'USER'
  setCurrentPage: Dispatch<SetStateAction<'PLANS' | 'FORM' | 'USER'>>
  selectedPlan?: 'Sandbox' | 'Dedicated'
  setSelectedPlan: Dispatch<SetStateAction<'Sandbox' | 'Dedicated' | undefined>>
  reload: boolean
  setReload: Dispatch<SetStateAction<boolean>>
  createUserSchema: yup.AnyObjectSchema
  openSlide: boolean
  setOpenSlide: Dispatch<SetStateAction<boolean>>
  createProjectSchema: yup.AnyObjectSchema
  createdSchemaName?: string
  setCreatedSchemaName: Dispatch<SetStateAction<string | undefined>>
}

type ProviderProps = {
  children: ReactNode
}

export const CreateProjectContext = createContext<CreateProjectContextProps>(
  {} as CreateProjectContextProps
)

export const CreateProjectProvider = ({ children }: ProviderProps) => {
  const [openSlide, setOpenSlide] = useState(false)
  const [reload, setReload] = useState(false)
  const [currentPage, setCurrentPage] = useState<'PLANS' | 'FORM' | 'USER'>(
    'PLANS'
  )
  const [createdSchemaName, setCreatedSchemaName] = useState<string>()
  const [selectedPlan, setSelectedPlan] = useState<'Sandbox' | 'Dedicated'>()

  const createProjectSchema = yup.object().shape({
    ProjectName: yup.string().required('Project name is a required field')
  })

  const createUserSchema = yup.object().shape({
    UserName: yup.string().required(),
    Email: yup.string().email().required(),
    Password: yup.string().required()
  })

  return (
    <CreateProjectContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedPlan,
        setSelectedPlan,
        reload,
        setReload,
        createUserSchema,
        openSlide,
        setOpenSlide,
        createProjectSchema,
        createdSchemaName,
        setCreatedSchemaName
      }}
    >
      {children}
    </CreateProjectContext.Provider>
  )
}

export const useCreateProject = () => {
  return useContext(CreateProjectContext)
}
