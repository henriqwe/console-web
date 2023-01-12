import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { Tour } from '.'
import '@testing-library/jest-dom'

let steps: any[] = []
let currentStep = 0
let isOpen = false
jest.mock('@reactour/tour', () => ({
  useTour: () => ({
    setSteps: (val: any[]) => {
      steps = val
    },
    setCurrentStep: (val: number) => {
      currentStep = val
    },
    setIsOpen: (val: boolean) => {
      isOpen = val
    }
  })
}))

let toastCalls: string[] = []
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn().mockImplementation((...args) => {
      toastCalls.push(args[0])
    }),
    error: jest.fn().mockImplementation((...args) => {
      toastCalls.push(args[0])
    })
  }
}))

let localToured = { section: '', val: false }
jest.mock('contexts/TourContext', () => ({
  useLocalTour: () => ({
    getToured: () => ({ dataapi: false }),
    setLocalToured: (section: string, val: boolean) => {
      localToured.section = section
      localToured.val = val
    }
  })
}))

describe('Tour', () => {
  afterEach(() => {
    steps = []
    currentStep = 0
    isOpen = false
    localToured = { section: '', val: false }
  })
  it('should render Tour component', () => {
    const { container } = render(<Tour />)

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should take the tour', () => {
    render(<Tour />)

    const takeTour = screen.getByText('Take the tour')
    fireEvent.click(takeTour)
    expect(isOpen).toBe(true)
  })

  it('should dismiss the tour', () => {
    render(<Tour />)

    const dismissTour = screen.getByText("I know what I'm doing")
    fireEvent.click(dismissTour)
    expect(localToured).toStrictEqual({ section: 'database', val: true })
  })
})
