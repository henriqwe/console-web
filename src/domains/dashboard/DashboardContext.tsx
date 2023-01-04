import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  Dispatch
} from 'react'
import * as yup from 'yup'
import * as utils from 'utils'
type DataContextProps = {
  selectedSchema?: Schemas
  setSelectedSchema: Dispatch<SetStateAction<Schemas | undefined>>
  reload: boolean
  setReload: Dispatch<SetStateAction<boolean>>
  createProjectSchema: (submittedSchema?: string) => yup.AnyObjectSchema
  openSlide: boolean
  setOpenSlide: Dispatch<SetStateAction<boolean>>
  slideType: SlideType
  setSlideType: Dispatch<SetStateAction<SlideType>>
  slideSize: SlideSize
  setSlideSize: Dispatch<SetStateAction<SlideSize>>
  schemas: Schemas[]
  setSchemas: Dispatch<SetStateAction<Schemas[]>>
  tickets: Tickets[]
  setTickets: Dispatch<SetStateAction<Tickets[]>>
  selectedTicket?: Tickets
  setSelectedTicket: Dispatch<SetStateAction<Tickets | undefined>>
  createdSchemaName?: string
  setCreatedSchemaName: Dispatch<SetStateAction<string | undefined>>
  adminUser?: AdminUser
  setAdminUser: Dispatch<SetStateAction<AdminUser | undefined>>
}

type Sections = 'projects' | 'helpAndSupport' | 'tutorialsAndDocs' | 'myAccount'

type SlideType =
  | 'createProject'
  | 'viewProject'
  | 'createTicket'
  | 'ViewAdminUser'

type SlideSize = 'normal' | 'halfPage' | 'fullPage'

type Schemas = {
  createdat: number
  name: string
  status: string
  tenantAc: string
  tenantId: string
}

export type Tickets = {
  logversion: number
  id: number
  project: string
  category: string
  title: string
  status: string
  content: string
}

type ProviderProps = {
  children: ReactNode
}
type AdminUser = {
  password: string
  username: string
}
export const DataContext = createContext<DataContextProps>(
  {} as DataContextProps
)

export const DataProvider = ({ children }: ProviderProps) => {
  const [openSlide, setOpenSlide] = useState(false)
  const [slideType, setSlideType] = useState<SlideType>('createProject')
  const [slideSize, setSlideSize] = useState<SlideSize>('normal')
  const [schemas, setSchemas] = useState<Schemas[]>([])
  const [reload, setReload] = useState(false)
  const [selectedSchema, setSelectedSchema] = useState<Schemas>()
  const [tickets, setTickets] = useState<Tickets[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Tickets>()
  const [createdSchemaName, setCreatedSchemaName] = useState<string>()

  const [adminUser, setAdminUser] = useState<AdminUser>()

  const createProjectSchema = (submittedSchema?: string) => {
    return yup.object().shape({
      ProjectName: submittedSchema
        ? yup.string().nullable()
        : yup
            .string()
            .min(3, 'Project name must be at least 3 characters')
            .matches(/^[A-Za-z ]*$/, 'Project name must be only letters')
            .required('Project name is a required field')
            .test(
              'space',
              'Project name should not contain spaces',
              (value) => !value?.includes(' ')
            )
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
        setSlideSize,
        schemas,
        setSchemas,
        tickets,
        setTickets,
        selectedTicket,
        setSelectedTicket,
        createdSchemaName,
        setCreatedSchemaName,
        adminUser,
        setAdminUser
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  return useContext(DataContext)
}
