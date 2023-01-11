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
import * as utils from 'utils'
import { getCookie } from 'utils/cookies'
import { useRouter } from 'next/router'

export type currentTabType = 'Data API' | 'Schema' | 'USERS'
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
  privateAttributes: string[]
  entities: string[]
  setEntities: Dispatch<SetStateAction<string[]>>
  loadEntities(): Promise<void>
  entitiesLoading: boolean
  setEntitiesLoading: Dispatch<SetStateAction<boolean>>
  createEntitySchema: (columnsGroup: number[]) => yup.AnyObjectSchema
  columnNames: string[]
  setColumnNames: Dispatch<SetStateAction<string[]>>
  addAttributeSchema: yup.AnyObjectSchema
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
  const router = useRouter()

  const [openSlide, setOpenSlide] = useState(false)
  const [slideType, setSlideType] = useState<'UPDATE' | 'UPDATE ENTITY'>(
    'UPDATE'
  )
  const [selectedTabUsersAndRoles, setSelectedTabUsersAndRoles] =
    useState<selectedTabUsersAndRolesType>({
      name: 'Roles'
    })
  const [selectedItemToExclude, setSelectedItemToExclude] = useState()
  const [reload, setReload] = useState(false)
  const [showCreateEntitySection, setShowCreateEntitySection] = useState(false)
  const [showTableViewMode, setShowTableViewMode] = useState(false)
  const [currentTab, setCurrentTab] = useState<currentTabType>('Schema')
  const [currentTabSchema, setCurrentTabSchema] =
    useState<currentTabSchemaType>('Modeler')
  const privateAttributes = [
    'logrole',
    'loguser',
    'logupdatedat',
    'logcreatedat'
  ]
  const [entities, setEntities] = useState<string[]>([])
  const [entitiesLoading, setEntitiesLoading] = useState(false)

  const [selectedEntity, setSelectedEntity] = useState<string>()
  const [entityData, setEntityData] = useState<types.EntityData[]>()
  const [schemaTables, setSchemaTables] = useState<types.SchemaTable>()
  const [slideState, setSlideState] = useState<slideState>({
    open: false,
    type: 'CodeExporterView'
  })

  const [schemaStatus, setSchemaStatus] = useState<number>()

  const fieldSchema = yup.object().shape({
    Name: yup
      .string()
      .required('Entity name is required')
      .test('equal', 'Entity name must contain only letters', (val) => {
        const validation = new RegExp(/^[A-Za-z ]*$/)
        return validation.test(val as string)
      })
      .test('equal', 'Entity name cannot contain spaces', (val) => {
        const validation = new RegExp(/\s/g)
        return !validation.test(val as string)
      }),
    Type: yup.object().required(),
    Nullable: yup.object().required(),
    Unique: yup.object().required(),
    Index: yup.object().required(),
    Comment: yup.string().required()
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

  async function loadEntities() {
    try {
      setEntitiesLoading(true)

      const { data } = await utils.api.get(
        `${utils.apiRoutes.entityList(router.query.name as string)}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie('access_token')}`
          }
        }
      )
      setSchemaTables(data)
      setEntities(Object.keys(data) as string[])
    } catch (err: any) {
      if (err.response.status !== 404) {
        utils.showError(err)
      }
    } finally {
      setEntitiesLoading(false)
    }
  }

  const [columnNames, setColumnNames] = useState<string[]>([])

  function createEntitySchema(columnsGroup: number[]) {
    let shape = {
      Name: yup
        .string()
        .required('Entity name is required')
        .test('equal', 'Entity name must contain only letters', (val) => {
          const validation = new RegExp(/^[A-Za-z ]*$/)
          return validation.test(val as string)
        })
        .test('equal', 'Entity name cannot contain spaces', (val) => {
          const validation = new RegExp(/\s/g)
          return !validation.test(val as string)
        })
    }

    for (const col of columnsGroup.filter((col) => col !== 0)) {
      shape = {
        ...shape,
        [`ColumnName${col}`]: yup
          .string()
          .required('Column name is required')
          .test('equal', 'Column cannot contain spaces', (val) => {
            const validation = new RegExp(/\s/g)
            return !validation.test(val as string)
          })
          .test('equal', 'Column name must contain only letters', (val) => {
            const validation = new RegExp(/^[A-Za-z ]*$/)
            return validation.test(val as string)
          })
          .test('equal', 'Column name must be unique', (val) => {
            if (
              columnNames
                .filter((col) => col !== '0' && col !== undefined)
                .filter((col) => col === val).length > 1
            ) {
              return false
            }
            return true
          }),
        [`Type${col}`]: yup.object(),
        [`Length${col}`]: yup
          .number()
          .typeError('Length must be a number')
          .nullable()
          .moreThan(-1, 'Length must be positive')
          .transform((_, val) => (val !== '' ? Number(val) : null)),
        [`Comment${col}`]: yup.string()
      }
    }

    return yup.object().shape(shape)
  }

  const addAttributeSchema = yup.object().shape({
    ColumnName: yup
      .string()
      .required('Column name is required')
      .test('equal', 'Column cannot contain spaces', (val) => {
        const validation = new RegExp(/\s/g)
        return !validation.test(val as string)
      })
      .test('equal', 'Column name must contain only letters', (val) => {
        const validation = new RegExp(/^[A-Za-z ]*$/)
        return validation.test(val as string)
      })
      .test('equal', 'Column name must be unique', (val) => {
        if (columnNames.indexOf(val ?? '') > -1) {
          return false
        }
        return true
      }),
    Type: yup.object().required('Column type is required'),
    Length: yup
      .number()
      .typeError('Length must be a number')
      .nullable()
      .moreThan(-1, 'Length must be positive')
      .transform((_, val) => (val !== '' ? Number(val) : null)),
    Comment: yup.string()
  })

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
        breadcrumbPages,
        setBreadcrumbPages,
        breadcrumbPagesData,
        schemaStatus,
        setSchemaStatus,
        goToEntitiesPage,
        goToModelerPage,
        currentTabSchema,
        setCurrentTabSchema,
        goToUserAndRolesPage,
        selectedTabUsersAndRoles,
        setSelectedTabUsersAndRoles,
        privateAttributes,
        entities,
        setEntities,
        loadEntities,
        entitiesLoading,
        setEntitiesLoading,
        createEntitySchema,
        columnNames,
        setColumnNames,
        addAttributeSchema
      }}
    >
      {children}
    </SchemaManagerContext.Provider>
  )
}

export const useSchemaManager = () => {
  return useContext(SchemaManagerContext)
}
