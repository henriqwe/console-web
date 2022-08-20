import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'

type ThemeContextProps = {
  isDark: boolean
}

type ProviderProps = {
  children: ReactNode
}

export const ThemeContext = createContext<ThemeContextProps>(
  {} as ThemeContextProps
)

export const ThemeProvider = ({ children }: ProviderProps) => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    window.onstorage = function () {
      setIsDark(isDarkTheme())
    }
    setIsDark(isDarkTheme())
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
    <ThemeContext.Provider value={{ isDark }}>{children}</ThemeContext.Provider>
  )
}

export const useTheme = () => {
  return useContext(ThemeContext)
}
