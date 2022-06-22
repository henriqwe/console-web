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
import { useRouter } from 'next/router'

type ConsoleEditorContextProps = {
  consoleValue: string | undefined
  setConsoleValue: Dispatch<SetStateAction<string | undefined>>
  globalJavaScriptCompletions: any
  formatQueryOrMutation(type: string, entity: string): void
}

type ProviderProps = {
  children: ReactNode
}

export const ConsoleEditorContext = createContext<ConsoleEditorContextProps>(
  {} as ConsoleEditorContextProps
)

export const ConsoleEditorProvider = ({ children }: ProviderProps) => {
  const router = useRouter()
  const [consoleValue, setConsoleValue] = useState<string>()

  const globalJavaScriptCompletions = javascriptLanguage.data.of({
    autocomplete: completeFromGlobalScope
  })

  async function loadParser() {
    const { data } = await axios.get(
      `http://localhost:3000/api/parser?parserName=${router.query.name}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie('access_token')}`
        }
      }
    )
    setConsoleValue(data.data)
  }
  function formatQueryOrMutation(type: string, entity: string) {
    switch (type) {
      case 'insert':
        setConsoleValue(
          `{\n "action":"CREATE",\n "object":{\n   "_entity": "${entity}",\n   "_role": "ROLE_ADMIN"\n }\n}`
        )
        break
      case 'update':
        setConsoleValue(
          `{\n "action":"UPDATE",\n "object":{\n   "_id": "",\n   "_entity": "${entity}",\n   "_role": "ROLE_ADMIN"\n }\n}`
        )
        break
      case 'delete':
        setConsoleValue('')
        break
      case 'select':
        setConsoleValue(
          `{\n "action":"READ",\n "object":{\n   "_entity": "${entity}",\n   "_role": "ROLE_ADMIN"\n }\n}`
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
  useEffect(() => {
    loadParser()
  }, [])

  return (
    <ConsoleEditorContext.Provider
      value={{
        consoleValue,
        setConsoleValue,
        globalJavaScriptCompletions,
        formatQueryOrMutation
      }}
    >
      {children}
    </ConsoleEditorContext.Provider>
  )
}

export const useConsoleEditor = () => {
  return useContext(ConsoleEditorContext)
}
