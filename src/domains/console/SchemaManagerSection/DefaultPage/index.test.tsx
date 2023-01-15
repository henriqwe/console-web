import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { DefaultPage } from '.'
import * as utils from 'utils'
import '@testing-library/jest-dom'

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

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: (val: string) => {
      mockPush(val)
    },
    query: { name: 'schema1' }
  })
}))

jest.mock('utils/api', () => ({
  api: {
    put: jest.fn()
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

let schemaStatus = 0
jest.mock('domains/console/SchemaManagerContext', () => ({
  useSchemaManager: () => ({
    schemaStatus,
    setSchemaStatus: (val: number) => {
      schemaStatus = val
    }
  })
}))

describe('DefaultPage', () => {
  afterEach(() => {
    toastCalls = []
  })

  it('should render DefaultPage component', () => {
    const { container } = render(<DefaultPage />)

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should publish the current schema', async () => {
    let requestedUrl = ''
    jest.spyOn(utils.api, 'put').mockImplementation(async (url: string) => {
      requestedUrl = url
    })
    render(<DefaultPage />)

    const toggle = screen.getByText('Publish version')

    fireEvent.click(toggle.lastChild as Element)

    await waitFor(() => {
      expect(requestedUrl).toBe('v0/modeling/project-name/schema1')
      expect(schemaStatus).toBe(2)
    })
  })

  it('should break publish the current schema action', async () => {
    jest.spyOn(utils.api, 'put').mockImplementation(async (url: string) => {
      throw new Error('it broke')
    })
    render(<DefaultPage />)

    const toggle = screen.getByText('Publish version')

    fireEvent.click(toggle.lastChild as Element)

    await waitFor(() => {
      expect(toastCalls.includes('it broke')).toBe(true)
    })
  })

  it('should unpublish the current schema', async () => {
    let requestedUrl = ''
    jest.spyOn(utils.api, 'put').mockImplementation(async (url: string) => {
      requestedUrl = url
    })
    render(<DefaultPage />)

    const toggle = screen.getByText('Publish version')

    fireEvent.click(toggle.lastChild as Element)

    await waitFor(() => {
      expect(requestedUrl).toBe('v0/modeling/project-name/schema1')
      expect(schemaStatus).toBe(2)
    })

    fireEvent.click(toggle.lastChild as Element)

    await waitFor(() => {
      expect(requestedUrl).toBe('v0/modeling/project-name/schema1')
    })
    expect(schemaStatus).toBe(1)
  })
})
