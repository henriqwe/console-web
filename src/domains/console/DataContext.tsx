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
  currentTab: 'Data Manager' | 'Schema Manager' | 'USERS'
  setCurrentTab: Dispatch<
    SetStateAction<'Data Manager' | 'Schema Manager' | 'USERS'>
  >
  selectedEntity?: string
  setSelectedEntity: Dispatch<SetStateAction<string | undefined>>
  reload: boolean
  setReload: Dispatch<SetStateAction<boolean>>
  fieldSchema: yup.AnyObjectSchema
  selectedItemToExclude: any
  setSelectedItemToExclude: Dispatch<SetStateAction<any>>
  openSlide: boolean
  setOpenSlide: Dispatch<SetStateAction<boolean>>
  entityData?: types.EntityData[]
  setEntityData: Dispatch<SetStateAction<types.EntityData[] | undefined>>
  showCreateEntitySection: boolean
  setShowCreateEntitySection: Dispatch<SetStateAction<boolean>>
  showTableViewMode: boolean
  setShowTableViewMode: Dispatch<SetStateAction<boolean>>
  slideType: 'UPDATE' | 'UPDATE ENTITY'
  setSlideType: Dispatch<SetStateAction<'UPDATE' | 'UPDATE ENTITY'>>
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
  const [slideType, setSlideType] = useState<'UPDATE' | 'UPDATE ENTITY'>(
    'UPDATE'
  )
  const [selectedItemToExclude, setSelectedItemToExclude] = useState()
  const [reload, setReload] = useState(false)
  const [showCreateEntitySection, setShowCreateEntitySection] = useState(false)
  const [showTableViewMode, setShowTableViewMode] = useState(false)
  const [currentTab, setCurrentTab] = useState<
    'Data Manager' | 'Schema Manager' | 'USERS'
  >('Schema Manager')
  const [selectedEntity, setSelectedEntity] = useState<string>()
  const [entityData, setEntityData] = useState<types.EntityData[]>()
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
        selectedEntity,
        setSelectedEntity,
        reload,
        setReload,
        fieldSchema,
        openSlide,
        setOpenSlide,
        selectedItemToExclude,
        setSelectedItemToExclude,
        entityData,
        setEntityData,
        showCreateEntitySection,
        setShowCreateEntitySection,
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
