import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'

import { useTour } from '@reactour/tour'

type TouredType = {
  dashboard: boolean
  modeler: boolean
  database: boolean
  users: boolean
  roles: boolean
  dataapi: boolean
}

type TourContextProps = {
  toured: TouredType
  getToured: () => TouredType
  setLocalToured: (
    section:
      | 'dashboard'
      | 'modeler'
      | 'database'
      | 'users'
      | 'roles'
      | 'dataapi',
    value: boolean
  ) => void
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
    modeler: false,
    database: false,
    users: false,
    roles: false,
    dataapi: false
  })
  const sections = [
    'dashboard',
    'modeler',
    'database',
    'users',
    'roles',
    'dataapi'
  ]

  useEffect(() => {
    const newToured = getToured()
    setToured(newToured)

    window.onstorage = function () {
      setToured(getToured())
    }
  }, [])

  function getToured() {
    let newToured = {} as TouredType

    sections.forEach((s) => {
      newToured = {
        ...newToured,
        [s]: window.localStorage.getItem(`toured-${s}`) === 'true'
      }
    })

    return newToured
  }

  function setLocalToured(
    section:
      | 'dashboard'
      | 'modeler'
      | 'database'
      | 'users'
      | 'roles'
      | 'dataapi',
    value: boolean
  ) {
    window.localStorage.setItem(`toured-${section}`, value.toString())
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
