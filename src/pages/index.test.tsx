import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import Home from './index'
import React from 'react'

let pushedRouter = ''
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: (val: string) => {
      pushedRouter = val
    }
  })
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

describe('Home', () => {
  it('should render Home', async () => {
    const { container } = render(<Home />)

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render Home and take the tour', async () => {
    const { container } = render(<Home />)

    expect(container.firstChild).toBeInTheDocument()

    const takeTheTourButton = screen.getByText('Take the tour')
    fireEvent.click(takeTheTourButton)

    const nextButton = screen.getByTestId('arrowRightIcon')
    fireEvent.click(nextButton)

    const previousButton = screen.getByTestId('arrowLeftIcon')
    fireEvent.click(previousButton)

    for (let index = 0; index < 7; index++) {
      fireEvent.click(nextButton)
    }
    expect(screen.getByText('Finish')).toBeInTheDocument()
  })
})
