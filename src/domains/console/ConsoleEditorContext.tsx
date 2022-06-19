import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  Dispatch
} from 'react'
type ConsoleEditorContextProps = {
  consoleValue: string | undefined
  setConsoleValue: Dispatch<SetStateAction<string | undefined>>
}

type ProviderProps = {
  children: ReactNode
}

export const ConsoleEditorContext = createContext<ConsoleEditorContextProps>(
  {} as ConsoleEditorContextProps
)

export const ConsoleEditorProvider = ({ children }: ProviderProps) => {
  const [consoleValue, setConsoleValue] = useState<string>()

  return (
    <ConsoleEditorContext.Provider
      value={{
        consoleValue,
        setConsoleValue
      }}
    >
      {children}
    </ConsoleEditorContext.Provider>
  )
}

export const useConsoleEditor = () => {
  return useContext(ConsoleEditorContext)
}
