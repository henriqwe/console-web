import { render, screen } from '@testing-library/react'
import { UsersSection } from '.'
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

let steps: any[] = []
let currentStep = 0
let isOpen = true
jest.mock('@reactour/tour', () => ({
  useTour: () => ({
    setSteps: (val: any[]) => {
      steps = val
    },
    setCurrentStep: (val: number) => {
      currentStep = val
    },
    setIsOpen: (val: boolean) => {
      isOpen = val
    }
  })
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
    delete: jest.fn()
  }
}))

let selectedEntity = 'books'
let selectedTabUsersAndRoles = { name: 'Users' }
jest.mock('domains/console/SchemaManagerContext', () => ({
  useSchemaManager: () => ({
    selectedEntity,
    selectedTabUsersAndRoles
  })
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

const setSlideType = jest.fn()
const setOpenSlide = jest.fn()
jest.mock('domains/console/UserContext', () => ({
  useUser: () => ({
    reload: false,
    setSlideType,
    setOpenSlide,
    setRoles: () => null,
    openSlide: false
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

describe('UsersSection', () => {
  afterEach(() => {
    toastCalls = []
    selectedEntity = 'books'
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
    selectedTabUsersAndRoles = { name: 'Users' }
  })

  it('should render UsersSection component', async () => {
    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      return {
        data: [
          {
            name: 'aleatorio',
            email: 'aleatorio@random.com',
            status: 0,
            roles: [{ name: 'role1' }]
          }
        ]
      }
    })
    const { container } = render(<UsersSection />)

    const welcomeMessage = screen.getByText('Welcome to the Users section!')
    expect(welcomeMessage).toBeInTheDocument()

    const loadingMessage = screen.getByText('Loading entity data')
    expect(loadingMessage).toBeInTheDocument()
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render UsersSection component without authorization', async () => {
    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      return {
        data: [
          {
            name: 'aleatorio',
            email: 'aleatorio@random.com',
            status: 0,
            roles: [{ name: 'role1' }]
          }
        ]
      }
    })
    user = { ...user, adminSchemaPassword: undefined }

    render(<UsersSection />)

    const welcomeMessage = screen.queryByText('Welcome to the Users section!')
    expect(welcomeMessage).not.toBeInTheDocument()

    const loadingMessage = screen.getByText('Authorization')
    expect(loadingMessage).toBeInTheDocument()
  })

  it('should render UsersSection component with role tab', async () => {
    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      return {
        data: [
          {
            name: 'aleatorio',
            email: 'aleatorio@random.com',
            status: 0,
            roles: [{ name: 'role1' }]
          }
        ]
      }
    })
    selectedTabUsersAndRoles = { name: 'Roles' }
    const { container } = render(<UsersSection />)

    const welcomeMessage = screen.getByText('Welcome to the Roles section!')
    expect(welcomeMessage).toBeInTheDocument()

    const loadingMessage = screen.getByText('Loading entity data')
    expect(loadingMessage).toBeInTheDocument()
    expect(container.firstChild).toBeInTheDocument()
  })
})
