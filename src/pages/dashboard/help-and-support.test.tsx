import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import HelpAndSupport from './help-and-support'
import React from 'react'

global.ResizeObserver = require('resize-observer-polyfill')

let pushedRouter = ''
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: (val: string) => {
      pushedRouter = val
    },
    query: { name: 'schema1' }
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

describe('HelpAndSupport', () => {
  it('should render HelpAndSupport', async () => {
    const { container } = render(
      <HelpAndSupport  />
    )

    expect(container.firstChild).toBeInTheDocument()
  })
})
