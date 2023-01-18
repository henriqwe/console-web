import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { SchemaManagerSection } from '.'
import * as utils from 'utils'
import '@testing-library/jest-dom'

class ResizeObserver {
  callback: globalThis.ResizeObserverCallback

  constructor(callback: globalThis.ResizeObserverCallback) {
    this.callback = callback
  }

  observe(target: Element) {
    this.callback([{ target } as globalThis.ResizeObserverEntry], this)
  }

  unobserve() {}

  disconnect() {}
}

global.ResizeObserver = ResizeObserver

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

const mock = function () {
  return {
    observe: jest.fn(),
    disconnect: jest.fn()
  }
}

//--> assign mock directly without jest.fn
window.IntersectionObserver = mock as any

jest.mock('utils/api', () => ({
  api: {
    put: jest.fn(),
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn()
  },
  localApi: {
    post: jest.fn()
  }
}))

let user = {
  name: 'string',
  email: 'string',
  image: 'string',
  accessToken: 'string',
  adminSchemaPassword: 'string',
  username: 'string',
  userData: null,
  gatewayPaymentKey: 'string'
} as any

jest.mock('contexts/UserContext', () => ({
  useUser: () => ({
    user,
    setUser: (val: typeof user) => {
      user = val
    }
  })
}))

const setOpenSlide = jest.fn()

let roles = [{ name: 'role1', status: 0 }] as any
jest.mock('domains/console/UserContext', () => ({
  useUser: () => ({
    setOpenSlide,
    roles,
    reload: false,
    setReload: () => null
  })
}))

const deploySchema = jest.fn()

jest.mock('domains/console/ConsoleEditorContext', () => ({
  useConsoleEditor: () => ({
    deploySchema: jest.fn(() => deploySchema())
  })
}))

let showCreateEntitySection = false
let currentTabSchema = 'Modeler'
let selectedEntity: string | undefined
let setBreadcrumbPages = 'string'
let setShowCreateEntitySection = jest.fn()
jest.mock('domains/console/SchemaManagerContext', () => ({
  useSchemaManager: () => ({
    selectedEntity,
    setOpenSlide,
    openSlide: false,
    reload: false,
    setEntityData: jest.fn(),
    showCreateEntitySection,
    setColumnNames: jest.fn(),
    breadcrumbPages: [
      {
        content: '',
        current: false
      }
    ],
    setSchemaStatus: jest.fn(),
    breadcrumbPagesData: jest.fn(),
    setBreadcrumbPages: jest.fn(),
    setShowCreateEntitySection: jest.fn((val) =>
      setShowCreateEntitySection(val)
    ),
    currentTabSchema,
    selectedTabUsersAndRoles: { name: 'Users' },
    setSelectedTabUsersAndRoles: jest.fn()
  })
}))

describe('AssociateAccount', () => {
  jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem')
  Object.setPrototypeOf(window.localStorage.setItem, jest.fn())
  afterEach(() => {
    toastCalls = []
    showCreateEntitySection = false
    selectedEntity = 'books'
    roles = [{ name: 'role1', status: 0 }]
    user = {
      name: 'string',
      email: 'string',
      image: 'string',
      accessToken: 'string',
      adminSchemaPassword: 'string',
      username: 'string',
      userData: null,
      gatewayPaymentKey: 'string'
    }
  })

  it('should render AssociateAccount component', async () => {
    let requestedUrl: string[] = []
    jest.spyOn(utils.api, 'get').mockImplementation(async (url: string) => {
      requestedUrl.push(url)
      return { data: { status: 200 } }
    })
    const { container } = render(<SchemaManagerSection />)

    waitFor(() => {
      expect(requestedUrl[0]).toBe('v0/modeling/project-name/schema1')
      expect(requestedUrl[1]).toBe(
        'v0/modeling/project-name/schema1/schema/sql/entity/books'
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  it('should break the start requisitions', async () => {
    let requestedUrl: string[] = []
    jest.spyOn(utils.api, 'get').mockImplementation(async (url: string) => {
      if (url === 'v0/modeling/project-name/schema1') {
        throw new Error('broke schema query')
      }
      if (url === 'v0/modeling/project-name/schema1/schema/sql/entity/books') {
        throw new Error('broke entity query')
      }
    })
    const { container } = render(<SchemaManagerSection />)

    waitFor(() => {
      expect(toastCalls.includes('broke schema query')).toBe(true)
      expect(toastCalls.includes('broke entity query')).toBe(true)

      expect(container.firstChild).toBeInTheDocument()
    })
  })

  it('should render AssociateAccount component with create entity content', async () => {
    showCreateEntitySection = true
    let requestedUrl: string[] = []
    jest.spyOn(utils.api, 'get').mockImplementation(async (url: string) => {
      requestedUrl.push(url)
      return { data: { status: 200 } }
    })
    const { container } = render(<SchemaManagerSection />)

    waitFor(() => {
      expect(screen.getByText('Entity name')).toBeInTheDocument()
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  it('should render AssociateAccount component with create entity content', async () => {
    let requestedUrl: string[] = []
    jest.spyOn(utils.api, 'get').mockImplementation(async (url: string) => {
      requestedUrl.push(url)
      return { data: { status: 200 } }
    })
    const { container } = render(<SchemaManagerSection />)

    waitFor(() => {
      expect(container.firstChild).toBeInTheDocument()
      const editIcon = screen.getByTestId('editIcon')
      fireEvent.click(editIcon)
      expect(setOpenSlide).toBeCalledWith(true)
    })
  })

  it('should handle deploy action', async () => {
    let requestedUrl: string[] = []
    jest.spyOn(utils.api, 'get').mockImplementation(async (url: string) => {
      requestedUrl.push(url)
      return { data: { status: 200 } }
    })
    const { container } = render(<SchemaManagerSection />)

    waitFor(() => {
      expect(container.firstChild).toBeInTheDocument()
      const deploy = screen.getByText('Deploy')
      fireEvent.click(deploy)
      expect(deploySchema).toBeCalled()
    })
  })

  it('should handle deploy action', async () => {
    currentTabSchema = 'Databases'
    selectedEntity = undefined
    let requestedUrl: string[] = []
    jest.spyOn(utils.api, 'get').mockImplementation(async (url: string) => {
      requestedUrl.push(url)
      return { data: { status: 200 } }
    })
    const { container } = render(<SchemaManagerSection />)

    waitFor(() => {
      expect(container.firstChild).toBeInTheDocument()
      const createEntity = screen.getByText('Create entity')
      fireEvent.click(createEntity)

      expect(setShowCreateEntitySection).toBeCalledWith(true)
    })
  })
})

// 'Modeler' | 'Databases' | 'Users and Roles'
// expect(window.localStorage.setItem).toHaveBeenCalledWith('clicked', 'yes')
