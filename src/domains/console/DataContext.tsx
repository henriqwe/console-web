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

type DataContextProps = {
  currentTab: 'API' | 'DATA' | 'USERS'
  setCurrentTab: Dispatch<SetStateAction<'API' | 'DATA' | 'USERS'>>
  selectedTable?: string
  setSelectedTable: Dispatch<SetStateAction<string | undefined>>
  reload: boolean
  setReload: Dispatch<SetStateAction<boolean>>
  fieldSchema: yup.AnyObjectSchema
  selectedItemToExclude: any
  setSelectedItemToExclude: Dispatch<SetStateAction<any>>
  openSlide: boolean
  setOpenSlide: Dispatch<SetStateAction<boolean>>
  tableData?: types.TableData[]
  setTableData: Dispatch<SetStateAction<types.TableData[] | undefined>>
  showCreateTableSection: boolean
  setShowCreateTableSection: Dispatch<SetStateAction<boolean>>
  showTableViewMode: boolean
  setShowTableViewMode: Dispatch<SetStateAction<boolean>>
  slideType: 'UPDATE' | 'UPDATE TABLE'
  setSlideType: Dispatch<SetStateAction<'UPDATE' | 'UPDATE TABLE'>>
  slideState: slideState
  setSlideState: Dispatch<SetStateAction<slideState>>
  schemaTables?: types.SchemaTable
  setSchemaTables: Dispatch<SetStateAction<types.SchemaTable | undefined>>
  relationshipSchema: yup.AnyObjectSchema
}

type ProviderProps = {
  children: ReactNode
}
type slideState = {
  open: boolean
  type: 'CodeExporterView'
}

export const DataContext = createContext<DataContextProps>(
  {} as DataContextProps
)

export const DataProvider = ({ children }: ProviderProps) => {
  const [openSlide, setOpenSlide] = useState(false)
  const [slideType, setSlideType] = useState<'UPDATE' | 'UPDATE TABLE'>(
    'UPDATE'
  )
  const [selectedItemToExclude, setSelectedItemToExclude] = useState()
  const [reload, setReload] = useState(false)
  const [showCreateTableSection, setShowCreateTableSection] = useState(false)
  const [showTableViewMode, setShowTableViewMode] = useState(false)
  const [currentTab, setCurrentTab] = useState<'API' | 'DATA' | 'USERS'>('DATA')
  const [selectedTable, setSelectedTable] = useState<string>()
  const [tableData, setTableData] = useState<types.TableData[]>()
  const [schemaTables, setSchemaTables] = useState<types.SchemaTable>()
  const [slideState, setSlideState] = useState<slideState>({
    open: false,
    type: 'CodeExporterView'
  })

  const fieldSchema = yup.object().shape({
    // Name: yup.string().required(),
    Type: yup.object().required(),
    Nullable: yup.object().required(),
    Unique: yup.object().required(),
    Index: yup.object().required(),
    Comment: yup.string().required()
  })

  const relationshipSchema = yup.object().shape({
    RelationshipName: yup.string().required('This field is required'),
    ReferenceEntity: yup.object().required('This field is required'),
    From: yup.object().required('This field is required'),
    To: yup.object().required('This field is required')
  })

  return (
    <DataContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        selectedTable,
        setSelectedTable,
        reload,
        setReload,
        fieldSchema,
        openSlide,
        setOpenSlide,
        selectedItemToExclude,
        setSelectedItemToExclude,
        tableData,
        setTableData,
        showCreateTableSection,
        setShowCreateTableSection,
        showTableViewMode,
        setShowTableViewMode,
        slideType,
        setSlideType,
        slideState,
        setSlideState,
        schemaTables,
        setSchemaTables,
        relationshipSchema
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  return useContext(DataContext)
}
