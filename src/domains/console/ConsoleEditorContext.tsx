import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  Dispatch,
  useEffect
} from 'react'
import axios from 'axios'
import { javascriptLanguage } from '@codemirror/lang-javascript'
import { getCookie } from 'utils/cookies'
import { completeFromGlobalScope } from './Console/Editors/Autocomplete'
import * as utils from 'utils'

type ConsoleEditorContextProps = {
  consoleValue: string
  setConsoleValue: Dispatch<SetStateAction<string>>
  globalJavaScriptCompletions: any
  formatQueryOrMutation(type: string, entity: string): void
  consoleResponse: string
  setConsoleResponse: Dispatch<SetStateAction<string>>
  runOperation(): Promise<void>
  consoleResponseLoading: boolean
  setconsoleResponseLoading: Dispatch<SetStateAction<boolean>>
}

type ProviderProps = {
  children: ReactNode
}

export const ConsoleEditorContext = createContext<ConsoleEditorContextProps>(
  {} as ConsoleEditorContextProps
)

export const ConsoleEditorProvider = ({ children }: ProviderProps) => {
  const [consoleValue, setConsoleValue] = useState<string>('')
  const [consoleResponse, setConsoleResponse] = useState<string>('')
  const [consoleResponseLoading, setconsoleResponseLoading] = useState(false)

  const globalJavaScriptCompletions = javascriptLanguage.data.of({
    autocomplete: completeFromGlobalScope
  })

  async function loadParser() {
    const { data } = await axios.get(
      `http://localhost:3000/api/parser?parserName=${'academia'}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie('access_token')}`
        }
      }
    )
  }

  function formatQueryOrMutation(type: string, entity: string) {
    switch (type) {
      case 'insert':
        setConsoleValue(
          `{\n "action":"CREATE",\n "object":{\n   "classUID": "${entity}",\n   "_role": "ROLE_ADMIN"\n }\n}`
        )
        break
      case 'update':
        setConsoleValue(
          `{\n "action":"UPDATE",\n "object":{\n   "_id": "",\n   "classUID: "${entity}",\n   "_role": "ROLE_ADMIN"\n }\n}`
        )
        break
      case 'delete':
        setConsoleValue('')
        break
      case 'select':
        setConsoleValue(
          `{\n "action":"READ",\n "object":{\n   "classUID": "${entity}",\n   "_role": "ROLE_ADMIN"\n }\n}`
        )
        break
      case 'select by pk':
        setConsoleValue('')
        break
      default:
        setConsoleValue('')
        break
    }
  }

  async function runOperation() {
    try {
      setconsoleResponseLoading(true)
      const { data } = await axios.post(
        `http://localhost:3000/api/interpreter`,
        {
          data: JSON.parse(consoleValue)
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie('access_token')}`
          }
        }
      )
      let text = ''
      for (const textData of data.data) {
        const formatedResponse = await formatResponse(JSON.stringify(textData))
        text += `${formatedResponse},\n`
      }
      setConsoleResponse(text)
      utils.notification('Operação realizada com sucesso', 'success')
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
    loadParser()
  }, [])

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
        setconsoleResponseLoading
      }}
    >
      {children}
    </ConsoleEditorContext.Provider>
  )
}

export const useConsoleEditor = () => {
  return useContext(ConsoleEditorContext)
}
