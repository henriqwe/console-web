import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor
} from '@testing-library/react'
import { Projects } from '.'
import '@testing-library/jest-dom'
import * as tour from 'contexts/TourContext'

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
        throw { response: { status: 400, message: 'it broke' } }
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
let selectedSchema: Schema
let slideType: string
let openSlide: boolean
let slideSize: string
jest.mock('domains/dashboard/DashboardContext', () => {
  return {
    ...jest.requireActual('domains/dashboard/DashboardContext'),
    useData: () => ({
      setOpenSlide: (val: boolean) => {
        openSlide = val
      },
      setSlideType: (val: string) => {
        slideType = val
      },
      setSlideSize: (val: string) => {
        slideSize = val
      },
      setSelectedSchema: (val: Schema) => {
        selectedSchema = val
      },
      selectedSchema,
      reload: false,
      schemas: receivedSchemas,
      setSchemas: (val: Schema[]) => {
        receivedSchemas = val
      },
      openSlide: true,
      slideType: '',
      slideSize: 'normal'
    })
  }
})

let pushedRoute: string
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: (route: string) => {pushedRoute = route}
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

describe('Projects', () => {
  afterEach(() => {
    schemas = []
    toastCalls = []
    cookiesSetted = []
    selectedSchema = {} as Schema
    slideType = ''
    openSlide = false
    slideSize = ''
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

  it('should render all projects and filter one', async () => {
    jest.useFakeTimers()
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
        jest.runOnlyPendingTimers()
      })
    })

    expect(container.firstChild).toBeInTheDocument()

    expect(screen.queryByText('Projects not found')).not.toBeInTheDocument()
    const projectList = screen.queryByTestId('projects')
    expect(projectList?.childElementCount).toBe(2)

    const schema2 = screen.getByText('schema 2')

    const searchInput = screen.getByPlaceholderText('Search Projects...')
    fireEvent.change(searchInput, { target: { value: 'schema 1' } })

    act(() => {
      jest.runOnlyPendingTimers()
    })

    expect(schema2).not.toBeInTheDocument()
    expect(projectList?.childElementCount).toBe(1)
  })

  it('should open config slide of selected project', async () => {
    jest.useFakeTimers()
    schemas = [
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
        jest.runOnlyPendingTimers()
      })
    })

    expect(container.firstChild).toBeInTheDocument()

    const schema2 = screen.getByTitle('configuration')

    fireEvent.click(schema2)

    expect(selectedSchema.name).toBe('schema 2')
    expect(slideType).toBe('viewProject')
    expect(openSlide).toBe(true)
    expect(slideSize).toBe('normal')
  })

  it('should open config slide to create a new project', async () => {
    jest.useFakeTimers()
    schemas = [
      {
        createdat: 2,
        name: 'schema 2',
        status: 'unactive',
        tenantAc: '12357',
        tenantId: '45689'
      }
    ]
const nextTour = jest.fn()
    const { result } = renderHook(() => tour.useLocalTour())
    jest.spyOn(tour, 'useLocalTour').mockImplementation(() => ({
      ...result.current,
      nextStep: nextTour
    }))
    render(<Projects />)

    

    expect(screen.getByText('Loading projects')).toBeInTheDocument()

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
        jest.runOnlyPendingTimers()
      })
    })

    const createProjectButton = screen.getByText('New Project')

    fireEvent.click(createProjectButton)

    expect(slideType).toBe('createProject')
    expect(openSlide).toBe(true)
    expect(slideSize).toBe('normal')
    expect(nextTour).toBeCalled()
  })

  it('should copy project secret', async () => {
    jest.useFakeTimers()

    Object.assign(window.navigator, {
      clipboard: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      },
    })

    schemas = [
      {
        createdat: 2,
        name: 'schema 2',
        status: 'unactive',
        tenantAc: '12357',
        tenantId: '45689'
      }
    ]
    render(<Projects />)
    expect(screen.getByText('Loading projects')).toBeInTheDocument()

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
        jest.runOnlyPendingTimers()
      })
    })

    const copyProjectDiv = screen.getByTitle('Copy')

    jest.spyOn(navigator.clipboard, 'writeText')
    fireEvent.click(copyProjectDiv.firstElementChild as Element)

    jest.runOnlyPendingTimers()

    expect(navigator.clipboard.writeText).toBeCalledWith('12357')
    expect(toastCalls.includes('Copied to clipboard')).toBe(true)
  })

  it('should access selected project', async () => {
    jest.useFakeTimers()

    schemas = [
      {
        createdat: 2,
        name: 'schema2',
        status: 'unactive',
        tenantAc: '12357',
        tenantId: '45689'
      }
    ]
    render(<Projects />)
    expect(screen.getByText('Loading projects')).toBeInTheDocument()

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
        jest.runOnlyPendingTimers()
      })
    })

    const playButton = screen.getByTitle('Access project')

    jest.spyOn(navigator.clipboard, 'writeText')
    fireEvent.click(playButton)

    expect(pushedRoute).toBe('/console/schema2')
  })
})
