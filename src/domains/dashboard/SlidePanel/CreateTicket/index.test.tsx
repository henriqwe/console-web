import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { CreateTicket } from '.'
import * as utils from 'utils'
import '@testing-library/jest-dom'

window.prompt = jest.fn()

let itShouldBreak = false
jest.mock('utils/api', () => ({
  api: {
    get: async (url: string, config: any) => {
      if (url === 'v0/modeling/project-name') {
        return {
          data: [
            {
              name: 'schema',
              createdat: 0,
              status: 'string',
              tenantAc: 'string',
              tenantId: 'string'
            }
          ]
        }
      }
      if (itShouldBreak) {
        throw new Error('It broke')
      }
      return {
        data: [
          {
            name: 'schema',
            createdat: 0,
            status: 'string',
            tenantAc: 'string',
            tenantId: 'string'
          }
        ]
      }
    }
  },
  localApi: {
    post: jest.fn()
  }
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

jest.mock('utils/cookies', () => {
  return {
    getCookie: () => '123'
  }
})

jest.mock('domains/dashboard/DashboardContext', () => ({
  ...jest.requireActual('domains/dashboard/DashboardContext'),
  useData: () => ({
    createdSchemaName: 'schema',
    setOpenSlide: () => null,
    setReload: () => null,
    reload: null
  })
}))

const mock = function () {
  return {
    observe: jest.fn(),
    disconnect: jest.fn()
  }
}

//--> assign mock directly without jest.fn
window.IntersectionObserver = mock as any

describe('CreateTicket', () => {
  afterEach(() => {
    toastCalls = []
  })
  it('should render CreateTicket component', async () => {
    const { container } = render(<CreateTicket />)

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    })
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should handle the submit action', async () => {
    let requestedUrl = ''
    jest
      .spyOn(utils.localApi, 'post')
      .mockImplementation(async (url: string) => {
        requestedUrl = url
      })

    render(<CreateTicket />)

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    })
    await waitFor(() => {
      const projectSelect = screen.getByText('Select a Project...')

      fireEvent.click(projectSelect)
      const schemaOption = screen.getByText('schema')

      fireEvent.click(schemaOption)
    })

    const prioritySelect = screen.getByText('Select a Priority level...')

    fireEvent.click(prioritySelect)

    const priorityOption = screen.getByText('Low')

    fireEvent.click(priorityOption)

    const categorySelect = screen.getByText('Select a support Category...')

    fireEvent.click(categorySelect)

    const categoryOption = screen.getByText('Financial')

    fireEvent.click(categoryOption)

    const title = screen.getByPlaceholderText('Enter the ticket title...')

    fireEvent.change(title, { target: { value: 'test' } })

    const content = screen.getByPlaceholderText('Enter message...')

    fireEvent.change(content, { target: { value: 'content' } })

    const createButton = screen.getByText('Create ticket')

    fireEvent.click(createButton)

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    })
    await waitFor(() => {
      expect(toastCalls.includes('Ticket created successfully')).toBe(true)
      expect(requestedUrl).toBe('/support/ticket')
    })
  })

  it('should break the create ticket action', async () => {
    jest
      .spyOn(utils.localApi, 'post')
      .mockImplementation(async () => {
        throw new Error('It broke')
      })
    render(<CreateTicket />)

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    })
    await waitFor(() => {
      const projectSelect = screen.getByText('Select a Project...')

      fireEvent.click(projectSelect)
      const schemaOption = screen.getByText('schema')

      fireEvent.click(schemaOption)
    })

    const prioritySelect = screen.getByText('Select a Priority level...')

    fireEvent.click(prioritySelect)

    const priorityOption = screen.getByText('Low')

    fireEvent.click(priorityOption)

    const categorySelect = screen.getByText('Select a support Category...')

    fireEvent.click(categorySelect)

    const categoryOption = screen.getByText('Financial')

    fireEvent.click(categoryOption)

    const title = screen.getByPlaceholderText('Enter the ticket title...')

    fireEvent.change(title, { target: { value: 'test' } })

    const content = screen.getByPlaceholderText('Enter message...')

    fireEvent.change(content, { target: { value: 'content' } })

    const createButton = screen.getByText('Create ticket')

    fireEvent.click(createButton)

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    })

    await waitFor(() => {
      expect(toastCalls.includes('It broke')).toBe(true)
    })
  })
})
