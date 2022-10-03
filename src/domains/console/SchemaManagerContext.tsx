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

export type currentTabType = 'Data Api' | 'Schema' | 'USERS'
export type currentTabSchemaType = 'Modeler' | 'Databases' | 'Users and Roles'

type SchemaManagerContextProps = {
  currentTab: currentTabType
  setCurrentTab: Dispatch<SetStateAction<currentTabType>>
  currentTabSchema: currentTabSchemaType
  setCurrentTabSchema: Dispatch<SetStateAction<currentTabSchemaType>>
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
  goToEntitiesPage(): void
  goToModelerPage(): void
  goToUserAndRolesPage(): void
  selectedTabUsersAndRoles: selectedTabUsersAndRolesType
  setSelectedTabUsersAndRoles: Dispatch<
    SetStateAction<selectedTabUsersAndRolesType>
  >
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
type selectedTabUsersAndRolesType = {
  name: 'Users' | 'Roles'
}

export const SchemaManagerContext = createContext<SchemaManagerContextProps>(
  {} as SchemaManagerContextProps
)

export const SchemaManagerProvider = ({ children }: ProviderProps) => {
  const [openSlide, setOpenSlide] = useState(false)
  const [slideType, setSlideType] = useState<'UPDATE' | 'UPDATE ENTITY'>(
    'UPDATE'
  )
  const [selectedTabUsersAndRoles, setSelectedTabUsersAndRoles] =
    useState<selectedTabUsersAndRolesType>({
      name: 'Accounts'
    })
  const [selectedItemToExclude, setSelectedItemToExclude] = useState()
  const [reload, setReload] = useState(false)
  const [showCreateEntitySection, setShowCreateEntitySection] = useState(false)
  const [showTableViewMode, setShowTableViewMode] = useState(false)
  const [currentTab, setCurrentTab] = useState<currentTabType>('Schema')
  const [currentTabSchema, setCurrentTabSchema] =
    useState<currentTabSchemaType>('Databases')

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

  function goToEntitiesPage() {
    setShowCreateEntitySection(false)
    setSelectedEntity(undefined)
    setBreadcrumbPages(breadcrumbPagesData?.home)
    setCurrentTabSchema('Databases')
  }
  function goToModelerPage() {
    setShowCreateEntitySection(false)
    setSelectedEntity(undefined)
    setBreadcrumbPages(breadcrumbPagesData?.modeler)
    setCurrentTabSchema('Modeler')
  }
  function goToUserAndRolesPage() {
    setShowCreateEntitySection(false)
    setSelectedEntity(undefined)
    setBreadcrumbPages(breadcrumbPagesData?.userAndRoles)
    setCurrentTabSchema('Users and Roles')
  }
  const breadcrumbPagesData = {
    home: [
      { content: 'Schema', current: false },
      { content: 'Database', current: true }
    ],
    modeler: [
      { content: 'Schema', current: false },
      { content: 'Modeler', current: true }
    ],
    userAndRoles: [
      { content: 'Schema', current: false },
      { content: 'Users and roles', current: true }
    ],
    createEntity: [
      { content: 'Schema', current: false },
      {
        content: 'Database',
        current: false,
        action: goToEntitiesPage
      },
      { content: 'Create', current: true }
    ],
    viewEntity: (entityName: string) => [
      { content: 'Schema', current: false },
      {
        content: 'Database',
        current: false,
        action: goToEntitiesPage
      },
      { content: entityName, current: true }
    ],
    viewEntityRelationship: (entityName: string) => [
      { content: 'Schema', current: false },
      {
        content: 'Database',
        current: false,
        action: goToEntitiesPage
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
        goToEntitiesPage,
        goToModelerPage,
        currentTabSchema,
        setCurrentTabSchema,
        goToUserAndRolesPage,
        selectedTabUsersAndRoles,
        setSelectedTabUsersAndRoles
      }}
    >
      {children}
    </SchemaManagerContext.Provider>
  )
}

export const useSchemaManager = () => {
  return useContext(SchemaManagerContext)
}
