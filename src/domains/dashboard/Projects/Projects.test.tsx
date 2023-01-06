import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Projects } from '.'
import '@testing-library/jest-dom'

type Schema = {
  createdat: number
  name: string
  status: string
  tenantAc: string
  tenantId: string
}

window.prompt = jest.fn()

let itShouldBreak = false

let schemas: Schema[] = []
jest.mock('utils/api', () => ({
  api: {
    get: async (url: string, config: any) => {
      if (itShouldBreak) {
        throw {response:{status: 400, message: 'it broke'}}
      }
      if (url === 'v0/modeling/project-name') {
        return {
          data: schemas
        }
      }
    }
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

jest.mock('axios', () => {
  return {
    get: () => {
      if (itShouldBreak) {
        throw new Error('It broke')
      }
      return {
        data: {
          id: '123'
        }
      }
    }
  }
})

let cookiesSetted: string[] = []
jest.mock('utils/cookies', () => {
  return {
    getCookie: () => '123',
    setCookie: (name: string, val: string) => cookiesSetted.push(val)
  }
})

let receivedSchemas: Schema[] = []
jest.mock('domains/dashboard/DashboardContext', () => {
  return {
    ...jest.requireActual('domains/dashboard/DashboardContext'),
    useData: () => ({
      setOpenSlide: () => null,
      setSlideType: () => null,
      setSlideSize: () => 'normal',
      setSelectedSchema: () => null,
      reload: false,
      schemas: receivedSchemas,
      setSchemas: (val: Schema[]) => {
        console.log('val', val)
        receivedSchemas = val
      },
      openSlide: true,
      slideType: '',
      selectedSchema: { name: 'schema' },
      slideSize: 'normal'
    })
  }
})

const mock = function () {
  return {
    observe: jest.fn(),
    disconnect: jest.fn()
  }
}

//--> assign mock directly without jest.fn
window.IntersectionObserver = mock as any

describe('Projects', () => {
  afterEach(() => {
    schemas = []
    toastCalls = []
    cookiesSetted = []
    itShouldBreak = false
  })
  it('should render Projects component', async () => {
    const { container } = render(<Projects />)

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    })

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render all projects', async () => {
    schemas = [
      {
        createdat: 1,
        name: 'schema 1',
        status: 'active',
        tenantAc: '123',
        tenantId: '456'
      },
      {
        createdat: 2,
        name: 'schema 2',
        status: 'unactive',
        tenantAc: '12357',
        tenantId: '45689'
      }
    ]
    const { container } = render(<Projects />)
    expect(screen.getByText('Loading projects')).toBeInTheDocument()

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    })
    expect(container.firstChild).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByText('Projects not found')).not.toBeInTheDocument()
      const projectList = screen.queryByTestId('projects')
      expect(projectList?.childElementCount).toBe(2)
    })
  })

  it('should render all projects', async () => {
    schemas = [
      {
        createdat: 1,
        name: 'schema 1',
        status: 'active',
        tenantAc: '123',
        tenantId: '456'
      },
      {
        createdat: 2,
        name: 'schema 2',
        status: 'unactive',
        tenantAc: '12357',
        tenantId: '45689'
      }
    ]
    const { container } = render(<Projects />)
    expect(screen.getByText('Loading projects')).toBeInTheDocument()

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    })
    expect(container.firstChild).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByText('Projects not found')).not.toBeInTheDocument()
      const projectList = screen.queryByTestId('projects')
      expect(projectList?.childElementCount).toBe(2)
    })
  })

  it('should should break load schemas route', async () => {
    itShouldBreak = true
    const { container } = render(<Projects />)
    expect(screen.getByText('Loading projects')).toBeInTheDocument()

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    })
    expect(container.firstChild).toBeInTheDocument()
    await waitFor(() => {
      expect(toastCalls.includes('it broke')).toBe(true)
    })
  })
})
