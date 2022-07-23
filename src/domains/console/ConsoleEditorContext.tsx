import axios from 'axios'
import { getCookie } from 'utils'

import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  Dispatch,
  useEffect
} from 'react'
import { javascriptLanguage } from '@codemirror/lang-javascript'
import { completeFromGlobalScope } from './Console/Editors/Autocomplete'
import { useRouter } from 'next/router'
import * as data from 'domains/console'

import * as utils from 'utils'

type ConsoleEditorContextProps = {
  consoleValue: string
  setConsoleValue: Dispatch<SetStateAction<string>>
  consoleValueLastOperation: string
  setConsoleValueLastOperation: Dispatch<SetStateAction<string>>
  globalJavaScriptCompletions: any
  formatQueryOrMutation(type: string, entity: string): void
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
  tabsData: tabsDataType
  setTabsData: Dispatch<SetStateAction<tabsDataType>>
  schemaTabData: JSX.Element | undefined
  setSchemaTabData: Dispatch<SetStateAction<JSX.Element | undefined>>
}

type ProviderProps = {
  children: ReactNode
}

type tabsDataType = {
  title: string
  color: 'blue' | 'red'
  content: JSX.Element
}[]

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
  const { reload } = data.useData()
  const [codeExporterValue, setCodeExporterValue] = useState('')
  const [variablesValue, setVariablesValue] = useState('')

  const [schemaTabData, setSchemaTabData] = useState<JSX.Element>()
  const [tabsData, setTabsData] = useState<tabsDataType>([
    {
      title: 'Docs',
      color: 'blue',
      content: <div>Docs</div>
    },
    {
      title: 'Schema',
      color: 'red',
      content: <div>{schemaTabData}</div>
    }
  ])

  const globalJavaScriptCompletions = javascriptLanguage.data.of({
    autocomplete: completeFromGlobalScope
  })

  async function loadParser() {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/parser?parserName=${router.query.name}`,
        {
          headers: {
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        }
      )
      console.log('data.data', data.data)
      setdocumentationValue(data.data)
    } catch (err: any) {
      if (err.response.status !== 404) {
        utils.notification(err.message, 'error')
      }
    }
  }

  function formatQueryOrMutation(type: string, entity: string) {
    let action: string
    switch (type) {
      case 'insert':
        action = 'CREATE'
        break
      case 'update':
        action = 'UPDATE'
        break
      case 'delete':
        action = 'DELETE'
        break
      case 'select':
        action = 'READ'
        break
      case 'select by pk':
        action = 'READ'
        break
      default:
        action = 'READ'
        break
    }

    setConsoleValue(
      `{\n "action":"${action}",\n "object":{\n   "classUID": "${entity}",\n   "role": "ROLE_ADMIN"\n }\n}`
    )
  }

  async function runOperation() {
    try {
      setConsoleValueLastOperation(consoleValue)
      setconsoleResponseLoading(true)
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/interpreter`,
        {
          data: JSON.parse(consoleValue),
          schema: router.query.name,
          access_token: `${utils.getCookie('admin_access_token')}`,
          'X-TenantID': utils.getCookie('X-TenantID')
        },
        {
          headers: {
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        }
      )
      let text = ''
      if (data?.data) {
        setConsoleResponse(data?.data)
        if (Array.isArray(data.data)) {
          text = '[\n'
          for (const textData of data.data) {
            const formatedResponse = await formatResponse(
              JSON.stringify(textData)
            )
            text += ` ${formatedResponse},\n`
          }
          text += ']'
        }
        if (!Array.isArray(data.data)) {
          const formatedResponse = await formatResponse(
            JSON.stringify(data.data)
          )
          text = `${formatedResponse}`
        }
      }

      setConsoleResponseFormated(text)
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
      utils.notification(err.message, 'error')
    }
  }

  async function formatResponse(value: string) {
    let text = value
    const operations = [
      { searchValue: ',', replaceValue: ',\n  ' },
      { searchValue: '{', replaceValue: '{\n  ' },
      { searchValue: '}', replaceValue: '\n}' }
    ]
    operations.forEach((op) => {
      text = text.replaceAll(op.searchValue, op.replaceValue)
    })
    return text
  }

  function formaterCodeExporterValue() {
    const text = `  async function yc_persistence_service(jwt, tenantID, BODY) {
    const result = await fetch('https://api.ycodify.com/api/interpreter-p/s', 
    {
      method: 'POST',
      body: BODY,
      headers: {
      Authorization: 'Bearer '.concat(jwt),
      'X-TenantID': tenantID,
      'Content-Type': 'application/json',
      Accept: 'application/json'
      }
    })
    return await result.json()
  }
  
  const jwt = '${getCookie('admin_access_token')}'
  const tenantID = '${getCookie('X-TenantID')}'
  const BODY = ${consoleValueLastOperation}
 
  yc_persistence_service(jwt, tenantID, BODY) 
   
  `
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
          title: 'Schema',
          color: 'red',
          content: <div>{schemaTabData}</div>
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
        formatQueryOrMutation,
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
        setSchemaTabData
      }}
    >
      {children}
    </ConsoleEditorContext.Provider>
  )
}

export const useConsoleEditor = () => {
  return useContext(ConsoleEditorContext)
}
