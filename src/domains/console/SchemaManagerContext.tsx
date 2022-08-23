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

type SchemaManagerContextProps = {
  currentTab: 'Data Manager' | 'Schema Manager' | 'USERS'
  setCurrentTab: Dispatch<
    SetStateAction<'Data Manager' | 'Schema Manager' | 'USERS'>
  >
  selectedEntity?: string
  setSelectedEntity: Dispatch<SetStateAction<string | undefined>>
  reload: boolean
  setReload: Dispatch<SetStateAction<boolean>>
  fieldSchema: yup.AnyObjectSchema
  updateAssociationSchema: yup.AnyObjectSchema
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
  associationSchema: yup.AnyObjectSchema
  breadcrumbPages: breadcrumbPageType[]
  setBreadcrumbPages: Dispatch<SetStateAction<breadcrumbPageType[]>>
  breadcrumbPagesData: {
    home: breadcrumbPageType[]
    createEntity: breadcrumbPageType[]
    viewEntity: (entityName: string) => breadcrumbPageType[]
    viewEntityRelationship: (entityName: string) => breadcrumbPageType[]
  }
  schemaStatus?: number
  setSchemaStatus: Dispatch<SetStateAction<number | undefined>>
  returnToEntitiesPage(): void
}

type ProviderProps = {
  children: ReactNode
}

type slideState = {
  open: boolean
  type: 'CodeExporterView' | 'EndpointAndResquestHeadersView'
}

type breadcrumbPageType = {
  content: string
  current: boolean
  action?: () => void
}

export const SchemaManagerContext = createContext<SchemaManagerContextProps>(
  {} as SchemaManagerContextProps
)

export const SchemaManagerProvider = ({ children }: ProviderProps) => {
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

  const [schemaStatus, setSchemaStatus] = useState<number>()

  const fieldSchema = yup.object().shape({
    // Name: yup.string().required(),
    Type: yup.object().required(),
    Nullable: yup.object().required(),
    Unique: yup.object().required(),
    Index: yup.object().required(),
    Comment: yup.string().required()
  })

  const updateAssociationSchema = yup.object().shape({
    Name: yup.string().required()
  })

  const associationSchema = yup.object().shape({
    AssociationName: yup.string().required('This field is required'),
    ReferenceEntity: yup.object().required('This field is required')
  })

  function returnToEntitiesPage() {
    setShowCreateEntitySection(false)
    setSelectedEntity(undefined)
    setBreadcrumbPages(breadcrumbPagesData?.home)
  }
  const breadcrumbPagesData = {
    home: [
      { content: 'Schema manager', current: false },
      { content: 'Entities', current: true }
    ],
    createEntity: [
      { content: 'Schema manager', current: false },
      {
        content: 'Entities',
        current: false,
        action: returnToEntitiesPage
      },
      { content: 'Create', current: true }
    ],
    viewEntity: (entityName: string) => [
      { content: 'Schema manager', current: false },
      {
        content: 'Entities',
        current: false,
        action: returnToEntitiesPage
      },
      { content: entityName, current: true }
    ],
    viewEntityRelationship: (entityName: string) => [
      { content: 'Schema manager', current: false },
      {
        content: 'Entities',
        current: false,
        action: returnToEntitiesPage
      },
      { content: entityName, current: false },
      { content: 'Relationship', current: true }
    ]
  }
  const [breadcrumbPages, setBreadcrumbPages] = useState<breadcrumbPageType[]>(
    breadcrumbPagesData.home
  )

  return (
    <SchemaManagerContext.Provider
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
        associationSchema,
        breadcrumbPages,
        setBreadcrumbPages,
        breadcrumbPagesData,
        updateAssociationSchema,
        schemaStatus,
        setSchemaStatus,
        returnToEntitiesPage
      }}
    >
      {children}
    </SchemaManagerContext.Provider>
  )
}

export const useSchemaManager = () => {
  return useContext(SchemaManagerContext)
}
