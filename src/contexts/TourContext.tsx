import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'

import { useTour } from '@reactour/tour'

type TourContextProps = {
  toured: {
    dashboard: boolean
    console: boolean
  }
  getToured: () => {
    dashboard: boolean
    console: boolean
  }
  setLocalToured: (section: 'dashboard' | 'console', value: boolean) => void
  previousStep: () => void
  nextStep: () => void
}

type ProviderProps = {
  children: ReactNode
}

export const TourContext = createContext<TourContextProps>(
  {} as TourContextProps
)

export const TourProvider = ({ children }: ProviderProps) => {
  const { currentStep, setCurrentStep } = useTour()
  const [toured, setToured] = useState({
    dashboard: false,
    console: false
  })
  const sections = ['dashboard', 'console']

  useEffect(() => {
    const newToured = getToured()
    console.log(newToured)
    setToured(newToured)

    window.onstorage = function () {
      setToured(getToured())
    }
  }, [])

  function getToured() {
    let newToured = {} as {
      dashboard: boolean
      console: boolean
    }

    sections.forEach((s) => {
      newToured = {
        ...newToured,
        [s]: window.localStorage.getItem(`${s}-toured`) === 'true'
      }
    })

    return newToured
  }

  function setLocalToured(section: 'dashboard' | 'console', value: boolean) {
    window.localStorage.setItem(`${section}-toured`, value.toString())
  }

  function previousStep() {
    setCurrentStep(currentStep - 1)
  }

  function nextStep() {
    setCurrentStep(currentStep + 1)
  }

  return (
    <TourContext.Provider
      value={{ toured, getToured, setLocalToured, previousStep, nextStep }}
    >
      {children}
    </TourContext.Provider>
  )
}

export const useLocalTour = () => {
  return useContext(TourContext)
}
