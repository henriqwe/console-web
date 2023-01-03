import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Tour } from './Tour'
import '@testing-library/jest-dom'

let localToured = ''
jest.mock('contexts/TourContext', () => ({
  useLocalTour: () => ({
    getToured: () => ({
      dashboard: false
    }),
    setLocalToured: (val: string) => {
      localToured = val
    }
  })
}))

let isOpen = false
jest.mock('@reactour/tour', () => ({
  useTour() {
    return {
      ...jest.requireActual('@reactour/tour').useTour(),
      setIsOpen: (val: boolean) => {
        isOpen = val
      }
    }
  }
}))

describe('Tour', () => {
  it('should render Tour component', async () => {
    const { container } = render(<Tour />)

    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  it('should handle dismiss action', async () => {
    const { container } = render(<Tour />)

    const dismissButton = screen.getByText("I know what I'm doing")

    fireEvent.click(dismissButton)

    await waitFor(() => {
      expect(localToured).toBe('dashboard')
      expect(container.firstChild).not.toBeInTheDocument()
    })
  })

  it('should handle take your tour action', async () => {
    const { container } = render(<Tour />)

    const tourButton = screen.getByText("Take the tour")

    fireEvent.click(tourButton)

    await waitFor(() => {
      expect(isOpen).toBe(true)
      expect(container.firstChild).not.toBeInTheDocument()
    })
  })
})
