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
  slideType: SlideType
  setSlideType: Dispatch<SetStateAction<SlideType>>
  slideSize: SlideSize
  setSlideSize: Dispatch<SetStateAction<SlideSize>>
  currentSection: Sections
  setCurrentSection: Dispatch<SetStateAction<Sections>>
  schemas: Schemas[]
  setSchemas: Dispatch<SetStateAction<Schemas[]>>
  createTicketSchema: yup.AnyObjectSchema
  tickets: Tickets[]
  setTickets: Dispatch<SetStateAction<Tickets[]>>
  selectedTicket?: Tickets
  setSelectedTicket: Dispatch<SetStateAction<Tickets | undefined>>
}

type Sections =
  | 'projects'
  | 'helpAndSupport'
  | 'tutorialsAndDocs'
  | 'myAccount'
  | 'billing'

type SlideType = 'createProject' | 'viewProject' | 'createTicket'
type SlideSize = 'normal' | 'halfPage' | 'fullPage'

type Schemas = {
  createdat: number
  name: string
  status: string
  tenantAc: string
  tenantId: string
}

type Tickets = {
  ticketId: string
  project: string
  category: string
  message: string
  title: string
  status: string
}

type ProviderProps = {
  children: ReactNode
}

export const DataContext = createContext<DataContextProps>(
  {} as DataContextProps
)

export const DataProvider = ({ children }: ProviderProps) => {
  const [currentSection, setCurrentSection] = useState<Sections>('projects')
  const [openSlide, setOpenSlide] = useState(false)
  const [slideType, setSlideType] = useState<SlideType>('createProject')
  const [slideSize, setSlideSize] = useState<SlideSize>('normal')
  const [schemas, setSchemas] = useState<Schemas[]>([])
  const [reload, setReload] = useState(false)
  const [selectedSchema, setSelectedSchema] = useState<Schemas>()
  const [tickets, setTickets] = useState<Tickets[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Tickets>()

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

  const createTicketSchema = yup.object().shape({
    Project: yup.object().required('This field is required'),
    Priority: yup.object().required('This field is required'),
    Category: yup.object().required('This field is required'),
    Title: yup.string().required('This field is required'),
    Content: yup.string().required('This field is required')
  })

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
        currentSection,
        setCurrentSection,
        schemas,
        setSchemas,
        createTicketSchema,
        tickets,
        setTickets,
        selectedTicket,
        setSelectedTicket
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  return useContext(DataContext)
}
