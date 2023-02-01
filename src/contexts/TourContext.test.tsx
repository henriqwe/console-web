import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { TourProvider, useLocalTour } from './TourContext'
import React, { useEffect } from 'react'

let currentStep = 0
let setCurrentStep = jest.fn()
jest.mock('@reactour/tour', () => ({
  useTour: () => ({
    currentStep,
    setCurrentStep: jest.fn((val) => setCurrentStep(val))
  })
}))

describe('User context', () => {
  jest
    .spyOn(Object.getPrototypeOf(window.localStorage), 'getItem')
    .mockImplementation(() => {
      return 'true'
    })
  Object.setPrototypeOf(window.localStorage.getItem, jest.fn())

  jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem')
  Object.setPrototypeOf(window.localStorage.setItem, jest.fn())


  it('should render a component using user provider', async () => {
    const Component = () => {
      const { toured } = useLocalTour()

      return <div>{toured?.users ? 'true' : 'false'}</div>
    }
    render(
      <TourProvider>
        <Component />
      </TourProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(`true`)).toBeInTheDocument()
    })
  })

  it('should test window.onstorage function', async () => {
    const Component = () => {
      const { toured } = useLocalTour()

      useEffect(() => {
        if (toured?.users) {
          window.onstorage !== null && window.onstorage()
        }
      }, [toured?.users])

      return <div>{toured?.users ? 'true' : 'false'}</div>
    }
    render(
      <TourProvider>
        <Component />
      </TourProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(`true`)).toBeInTheDocument()
    })
  })

  it('should test setLocalToured function', async () => {
    const Component = () => {
      const { toured, setLocalToured } = useLocalTour()

      useEffect(() => {
        setLocalToured('users', false)
      }, [])

      return <div>{toured?.users ? 'true' : 'false'}</div>
    }
    render(
      <TourProvider>
        <Component />
      </TourProvider>
    )

    await waitFor(() => {
      expect(window.localStorage.setItem).toBeCalledWith(
        `toured-users`,
        'false'
      )
    })
  })

  it('should test previousStep function', async () => {
    const Component = () => {
      const { previousStep } = useLocalTour()

      useEffect(() => {
        previousStep()
      }, [])

      return <div></div>
    }
    render(
      <TourProvider>
        <Component />
      </TourProvider>
    )

    await waitFor(() => {
      expect(setCurrentStep).toBeCalledWith(-1)
    })
  })

  it('should test nextStep function', async () => {
    const Component = () => {
      const { nextStep } = useLocalTour()

      useEffect(() => {
        nextStep()
      }, [])

      return <div></div>
    }
    render(
      <TourProvider>
        <Component />
      </TourProvider>
    )

    await waitFor(() => {
      expect(setCurrentStep).toBeCalledWith(1)
    })
  })
})
