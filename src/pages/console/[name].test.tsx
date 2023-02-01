import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import Console, { getServerSideProps } from './[name]'
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

describe('Console', () => {
  it('should render Console', async () => {
    const { container } = render(
      <Console cookie={{ admin_access_token: '123' }} />
    )

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should test getServerSideProps function', async () => {
    const props = await getServerSideProps({
      req: { headers: { cookie: 'cookie="123"' } }
    })

    expect(props).toStrictEqual({ props: { cookie: { cookie: '123' } } })
  })
})
