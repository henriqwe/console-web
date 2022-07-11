import axios from 'axios'

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
import { getCookie } from 'utils/cookies'
import { completeFromGlobalScope } from './Console/Editors/Autocomplete'
import { useRouter } from 'next/router'

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
}

type ProviderProps = {
  children: ReactNode
}

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

  const globalJavaScriptCompletions = javascriptLanguage.data.of({
    autocomplete: completeFromGlobalScope
  })

  async function loadParser() {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/parser?parserName=${router.query.name}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie('access_token')}`
        }
      }
    )
    setdocumentationValue(data.data)
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
      `{\n "action":"${action}",\n "object":{\n   "classUID": "${entity}",\n   "_role": "ROLE_ADMIN"\n }\n}`
    )
  }

  async function runOperation() {
    try {
      setConsoleValueLastOperation(consoleValue)
      setconsoleResponseLoading(true)
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/interpreter`,
        {
          data: JSON.parse(consoleValue)
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie('access_token')}`
          }
        }
      )
      let text = '[\n'
      setConsoleResponse(data?.data)
      for (const textData of data.data) {
        const formatedResponse = await formatResponse(JSON.stringify(textData))
        text += ` ${formatedResponse},\n`
      }
      text += ']'
      setConsoleResponseFormated(text)
      utils.notification('Operation performed successfully', 'success')
      setconsoleResponseLoading(false)
    } catch (err: any) {
      utils.notification(err.message, 'error')
      setconsoleResponseLoading(false)
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
  useEffect(() => {
    if (router.query.name) {
      loadParser()
    }
  }, [router.query.name])

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
        setConsoleValueLastOperation
      }}
    >
      {children}
    </ConsoleEditorContext.Provider>
  )
}

export const useConsoleEditor = () => {
  return useContext(ConsoleEditorContext)
}
