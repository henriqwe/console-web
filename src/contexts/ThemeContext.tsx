import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from 'react'

type ThemeContextProps = {
  isDark: boolean
  setIsDark: Dispatch<SetStateAction<boolean>>
  isDarkTheme: () => boolean
}

type ProviderProps = {
  children: ReactNode
}

export const ThemeContext = createContext<ThemeContextProps>(
  {} as ThemeContextProps
)

export const ThemeProvider = ({ children }: ProviderProps) => {
  const [isDark, setIsDark] = useState(isDarkTheme())

  useEffect(() => {
    window.onstorage = function () {
      setIsDark(isDarkTheme())
    }
  }, [])

  function isDarkTheme() {
    try {
      const Theme = window.localStorage.getItem('theme')

      return Theme === 'dark'
    } catch (error) {
      return false
    }
  }

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, isDarkTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  return useContext(ThemeContext)
}
