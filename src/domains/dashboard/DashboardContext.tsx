import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  Dispatch
} from 'react'
import * as yup from 'yup'

type DataContextProps = {
  selectedSchema?: Schemas
  setSelectedSchema: Dispatch<SetStateAction<Schemas | undefined>>
  reload: boolean
  setReload: Dispatch<SetStateAction<boolean>>
  createProjectSchema: (submittedSchema?: string) => yup.AnyObjectSchema
  openSlide: boolean
  setOpenSlide: Dispatch<SetStateAction<boolean>>
  slideType: 'CREATE' | 'VIEW'
  setSlideType: Dispatch<SetStateAction<'CREATE' | 'VIEW'>>
  slideSize: 'normal' | 'halfPage' | 'fullPage'
  setSlideSize: Dispatch<SetStateAction<'normal' | 'halfPage' | 'fullPage'>>
}

type Schemas = {
  createdat: number
  name: string
  status: string
  tenantAc: string
  tenantId: string
}

type ProviderProps = {
  children: ReactNode
}

export const DataContext = createContext<DataContextProps>(
  {} as DataContextProps
)

export const DataProvider = ({ children }: ProviderProps) => {
  const [openSlide, setOpenSlide] = useState(false)
  const [slideType, setSlideType] = useState<'CREATE' | 'VIEW'>('CREATE')
  const [slideSize, setSlideSize] = useState<
    'normal' | 'halfPage' | 'fullPage'
  >('normal')
  const [reload, setReload] = useState(false)
  const [selectedSchema, setSelectedSchema] = useState<Schemas>()

  const createProjectSchema = (submittedSchema?: string) => {
    return yup.object().shape({
      ProjectName: submittedSchema
        ? yup.string().nullable()
        : yup
            .string()
            .matches(/^[A-Za-z ]*$/, 'Please enter valid name')
            .required('Project name is a required field')
    })
  }

  return (
    <DataContext.Provider
      value={{
        reload,
        setReload,
        createProjectSchema,
        openSlide,
        setOpenSlide,
        slideType,
        setSlideType,
        selectedSchema,
        setSelectedSchema,
        slideSize,
        setSlideSize
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  return useContext(DataContext)
}
