import { getCookie } from 'utils'

import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  Dispatch,
  useEffect,
  useCallback,
  useRef,
  MutableRefObject
} from 'react'
import { javascriptLanguage } from '@codemirror/lang-javascript'
import { completeFromGlobalScope } from './Console/Editors/Autocomplete'
import { useRouter } from 'next/router'
import * as data from 'domains/console'

import * as utils from 'utils'

export type actionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'READ'
export type attributesType =
  | 'Text'
  | 'Boolean'
  | 'Double'
  | 'Integer'
  | 'Long'
  | 'String'
  | 'Timestamp'
export type handleFormatQueryOrMutationActionType = {
  action: actionType
}
export type handleFormatQueryOrMutationEntityType = {
  entity: string
  attribute: string
  attributeType: attributesType
}

type ConsoleEditorContextProps = {
  consoleValue: string
  setConsoleValue: Dispatch<SetStateAction<string>>
  consoleValueLastOperation: string
  setConsoleValueLastOperation: Dispatch<SetStateAction<string>>
  globalJavaScriptCompletions: any
  handleFormatQueryOrMutationEntity({
    entity,
    attribute,
    attributeType
  }: handleFormatQueryOrMutationEntityType): void
  consoleResponse: any[]
  setConsoleResponse: Dispatch<SetStateAction<never[]>>
  runOperation(): Promise<void>
  consoleResponseLoading: boolean
  setconsoleResponseLoading: Dispatch<SetStateAction<boolean>>
  documentationValue: string
  setdocumentationValue: Dispatch<SetStateAction<string>>
  consoleResponseFormated: string
  setConsoleResponseFormated: Dispatch<SetStateAction<string>>
  responseTime: number | undefined
  codeExporterValue: string
  setCodeExporterValue: Dispatch<SetStateAction<string>>
  variablesValue: string
  setVariablesValue: Dispatch<SetStateAction<string>>
  formaterCodeExporterValue(): void
  tabsData: tabsDataType | undefined
  setTabsData: Dispatch<SetStateAction<tabsDataType | undefined>>
  schemaTabData: JSX.Element | undefined
  setSchemaTabData: Dispatch<SetStateAction<JSX.Element | undefined>>
  valueToFormat: MutableRefObject<string>
  format: MutableRefObject<FormatterFunction | undefined>
  handleFormat: () => void
  handleChange: (input: string) => void
  setFormatter: (func: FormatterFunction) => void
  handleFormatQueryOrMutationAction({
    action
  }: handleFormatQueryOrMutationActionType): void
  activeEntitiesSidebar: Set<string>
  setActiveEntitiesSidebar: Dispatch<SetStateAction<Set<string>>>
}

type ProviderProps = {
  children: ReactNode
}

type tabsDataType = {
  title: string
  color: 'blue' | 'red'
  content: JSX.Element
}[]

type FormatterFunction = (text: string) => string

export const ConsoleEditorContext = createContext<ConsoleEditorContextProps>(
  {} as ConsoleEditorContextProps
)

export const ConsoleEditorProvider = ({ children }: ProviderProps) => {
  const [consoleValue, setConsoleValue] = useState('')
  const [consoleValueLastOperation, setConsoleValueLastOperation] = useState('')
  const [documentationValue, setdocumentationValue] = useState('')
  const [consoleResponse, setConsoleResponse] = useState([])
  const [consoleResponseFormated, setConsoleResponseFormated] = useState('')
  const [consoleResponseLoading, setconsoleResponseLoading] = useState(false)
  const router = useRouter()
  const [responseTime, setResponseTime] = useState<number>()
  const { reload } = data.useSchemaManager()
  const [codeExporterValue, setCodeExporterValue] = useState('')
  const [variablesValue, setVariablesValue] = useState('')
  const [schemaTabData, setSchemaTabData] = useState<JSX.Element>()
  const [tabsData, setTabsData] = useState<tabsDataType>()
  const format = useRef<FormatterFunction>()
  const valueToFormat = useRef<string>('')
  const [activeEntitiesSidebar, setActiveEntitiesSidebar] = useState(
    new Set<string>()
  )

  const handleFormat = useCallback(() => {
    try {
      valueToFormat.current = format?.current
        ? format?.current(valueToFormat.current)
        : ''
      if (valueToFormat.current !== consoleValue)
        setConsoleValue(valueToFormat.current)
      else {
        // Edge case: Only formatting was changed (this would not trigger re-render)
        // Use a dummy value to force update code
        setConsoleValue(valueToFormat.current + ' ')
        // Then use delay to immidiately correct it
        setTimeout(() => setConsoleValue(valueToFormat.current.slice(0, -1)), 0)
      }
    } catch (error) {
      console.log('error', error)
      utils.notification('There was an error formatting', 'error')
    }
  }, [consoleValue])

  const handleChange = useCallback((input: string) => {
    valueToFormat.current = input
  }, [])

  const setFormatter = useCallback((func: FormatterFunction) => {
    format.current = func
  }, [])
  const globalJavaScriptCompletions = javascriptLanguage.data.of({
    autocomplete: completeFromGlobalScope
  })

  async function loadParser() {
    try {
      const { data } = await utils.localApi.get(
        utils.apiRoutes.local.parser(router.query.name as string),
        {
          headers: {
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        }
      )
      setdocumentationValue(data.data)
    } catch (err: any) {
      console.log(err)
      if (err?.response?.status !== 404) {
        utils.showError(err)
      }
    }
  }

  function handleFormatQueryOrMutationEntity({
    entity,
    attribute,
    attributeType
  }: handleFormatQueryOrMutationEntityType) {
    let value: { action: actionType; data: any[] }
    let attributeTypeValue: any

    switch (attributeType) {
      case 'String':
        attributeTypeValue = ''
        break
      case 'Text':
        attributeTypeValue = ''
        break
      case 'Timestamp':
        attributeTypeValue = ''
        break
      case 'Boolean':
        attributeTypeValue = false
        break
      case 'Integer':
        attributeTypeValue = 0
        break
      case 'Long':
        attributeTypeValue = 0
        break
      case 'Double':
        attributeTypeValue = 0.0
        break
      default:
        attributeTypeValue = { [attributeType]: {} }
        break
    }
    try {
      value = JSON.parse(consoleValue)

      //Verifica  se existe a entidade
      const existingEntity = value.data.filter((valueDataEntity) =>
        Object.keys(valueDataEntity).includes(entity)
      )

      // Adiciona a entidade e atributo caso não existam
      if (!existingEntity.length) {
        value.data.push({ [entity]: { [attribute]: attributeTypeValue } })
      }

      if (existingEntity.length) {
        // Lindando com os atributos se existir remove, senão adiciona
        for (const [index, valueDataEntity] of value.data.entries()) {
          if (Object.keys(valueDataEntity).includes(entity)) {
            if (Object.keys(valueDataEntity[entity]).includes(attribute)) {
              delete valueDataEntity[entity][attribute]

              //Caso a entidade seja um objeto vazio remove
              if (!Object.keys(valueDataEntity[entity]).length) {
                value.data.splice(index, 1)
              }
              break
            }
            valueDataEntity[entity][attribute] = attributeTypeValue
          }
        }
      }
    } catch (err) {
      value = {
        action: 'READ',
        data: [{ [entity]: { [attribute]: attributeTypeValue } }]
      }
    }

    formatValueToSetInConsole(value)
  }

  function handleFormatQueryOrMutationAction({
    action
  }: handleFormatQueryOrMutationActionType) {
    let value: { action: actionType; data: any[] }

    try {
      value = JSON.parse(consoleValue)

      value.action = action
    } catch (err) {
      value = { action, data: [] }
    }

    formatValueToSetInConsole(value)
  }

  function formatValueToSetInConsole(value: {
    action: actionType
    data: any[]
  }) {
    const valueStringify = JSON.stringify(value, null, 4)

    const formatedValue = format?.current
      ? format?.current(valueStringify)
      : valueStringify

    setConsoleValue(formatedValue)
  }

  async function runOperation() {
    try {
      setConsoleValueLastOperation(consoleValue)
      setconsoleResponseLoading(true)
      const { data } = await utils.localApi.post(
        utils.apiRoutes.local.interpreter,
        {
          data: JSON.parse(consoleValue),
          access_token: `${utils.getCookie('access_token')}`,
          'X-TenantID': utils.getCookie('X-TenantID'),
          'X-TenantAC': utils.getCookie('X-TenantAC')
        },
        {
          headers: {
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        }
      )
      let formatedValue = ''
      formatedValue = format?.current
        ? format?.current(JSON.stringify(data.data, null, 4))
        : data.data
      setConsoleResponse(data?.data)
      setConsoleResponseFormated(formatedValue)
      setResponseTime(data.responseTimeMs)
      setconsoleResponseLoading(false)

      utils.notification('Operation performed successfully', 'success')
    } catch (err: any) {
      setconsoleResponseLoading(false)
      setResponseTime(undefined)
      setConsoleResponseFormated('')
      setConsoleResponse([])

      if (err?.request?.status === 404) {
        utils.notification('object or objects not found.', 'error')
        return
      }

      utils.showError(err)
    }
  }

  function formaterCodeExporterValue() {
    const text = `async function yc_persistence_service(tenantAC, tenantID, BODY) {
  const result = await fetch('${process.env.NEXT_PUBLIC_YCODIFY_API_URL}/${
      utils.apiRoutes.interpreter
    }', 
  {
    method: 'POST',
    body: BODY,
    headers: {
    'X-TenantAC': tenantAC,
    'X-TenantID': tenantID,
    'Content-Type': 'application/json',
    Accept: 'application/json'
    }
  })
  return await result.json()
}

const tenantAC = '${getCookie('X-TenantAC')}'
const tenantID = '${getCookie('X-TenantID')}'
const BODY = ${JSON.stringify(consoleValueLastOperation)}

yc_persistence_service(tenantAC, tenantID, BODY)`
    setCodeExporterValue(text)
  }

  useEffect(() => {
    if (router.query.name) {
      loadParser()
    }
  }, [router.query.name, reload])

  useEffect(() => {
    if (schemaTabData) {
      setTabsData([
        {
          title: 'Docs',
          color: 'blue',
          content: <div>Docs</div>
        },
        {
          title: 'Spec',
          color: 'blue',
          content: (
            <div className="p-4 leading-5 rounded-lg bg-gray-50 dark:bg-gray-900">
              {schemaTabData}
            </div>
          )
        }
      ])
    }
  }, [schemaTabData])

  return (
    <ConsoleEditorContext.Provider
      value={{
        consoleValue,
        setConsoleValue,
        globalJavaScriptCompletions,
        handleFormatQueryOrMutationEntity,
        consoleResponse,
        setConsoleResponse,
        runOperation,
        consoleResponseLoading,
        setconsoleResponseLoading,
        documentationValue,
        setdocumentationValue,
        consoleResponseFormated,
        setConsoleResponseFormated,
        consoleValueLastOperation,
        setConsoleValueLastOperation,
        responseTime,
        codeExporterValue,
        setCodeExporterValue,
        variablesValue,
        setVariablesValue,
        formaterCodeExporterValue,
        tabsData,
        setTabsData,
        schemaTabData,
        setSchemaTabData,
        valueToFormat,
        format,
        handleFormat,
        handleChange,
        setFormatter,
        handleFormatQueryOrMutationAction,
        activeEntitiesSidebar,
        setActiveEntitiesSidebar
      }}
    >
      {children}
    </ConsoleEditorContext.Provider>
  )
}

export const useConsoleEditor = () => {
  return useContext(ConsoleEditorContext)
}
