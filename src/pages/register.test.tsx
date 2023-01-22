import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import Register from './register'
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

describe('Register', () => {
  it('should render Register', async () => {
    const { container } = render(<Register />)

    expect(container.firstChild).toBeInTheDocument()
  })
})
