import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { UsersTab } from '.'
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
jest.mock('domains/console/SchemaManagerContext', () => ({
  useSchemaManager: () => ({
    selectedEntity
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
    setOpenSlide
  })
}))

describe('UsersTab', () => {
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
  })

  it('should render UsersTab component', async () => {
    let requestedUrl = ''
    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      requestedUrl = url
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
    const { container } = render(<UsersTab />)

    const loadingMessage = screen.getByText('Loading entity data')
    expect(loadingMessage).toBeInTheDocument()

    await waitFor(() => {
      expect(requestedUrl).toBe('v0/id/account/get-all')
      expect(container.firstChild).toBeInTheDocument()
      expect(loadingMessage).not.toBeInTheDocument()
    })
  })

  it('should render UsersTab component without authorization', async () => {
    user = { ...user, adminSchemaPassword: undefined }

    render(<UsersTab />)

    const authorizationButton = screen.getByText('Authorization')
    fireEvent.click(authorizationButton)

    expect(setSlideType).toBeCalledWith('ADMINLOGIN')
    expect(setOpenSlide).toBeCalledWith(true)
  })

  it('should open modal to create a new account', async () => {
    let requestedUrl = ''
    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      requestedUrl = url
      return {
        data: [
          {
            name: 'aleatorio',
            email: 'aleatorio@random.com',
            status: 1,
            roles: [{ name: 'role1' }]
          }
        ]
      }
    })
    const { container } = render(<UsersTab />)

    expect(container.firstChild).toHaveClass('items-center justify-center')

    const loadingMessage = screen.getByText('Loading entity data')
    expect(loadingMessage).toBeInTheDocument()

    await waitFor(() => {
      expect(requestedUrl).toBe('v0/id/account/get-all')
      expect(container.firstChild).toBeInTheDocument()

      expect(loadingMessage).not.toBeInTheDocument()
    })

    const createButton = screen.getByText('Create')
    fireEvent.click(createButton)

    expect(setSlideType).toBeCalledWith('ACCOUNT')
    expect(setOpenSlide).toBeCalledWith(true)
  })

  it('should open modal to associate a new account', async () => {
    let requestedUrl = ''
    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      requestedUrl = url
      return {
        data: [
          {
            name: 'aleatorio',
            email: undefined,
            status: 0,
            roles: [{ name: 'role1' }, { name: 'role2' }]
          }
        ]
      }
    })
    const { container } = render(<UsersTab />)

    expect(container.firstChild).toHaveClass('items-center justify-center')

    const loadingMessage = screen.getByText('Loading entity data')
    expect(loadingMessage).toBeInTheDocument()

    await waitFor(() => {
      expect(requestedUrl).toBe('v0/id/account/get-all')
      expect(container.firstChild).toBeInTheDocument()

      expect(loadingMessage).not.toBeInTheDocument()
    })

    const notActiveMessage = screen.getByText('Not Active')
    expect(notActiveMessage).toBeInTheDocument()

    const associateButton = screen.getByText('Associate')
    fireEvent.click(associateButton)

    expect(setSlideType).toBeCalledWith('ACCOUNT')
    expect(setOpenSlide).toBeCalledWith(true)
  })

  it('should break submit action', async () => {
    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      throw { response: { status: 400, message: 'it broke' } }
    })
    const { rerender } = render(<UsersTab />)

    await waitFor(() => {
      expect(toastCalls.includes('it broke')).not.toBe(true)
    })

    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      throw { response: { status: 500 }, message: 'it broke' }
    })

    user = { ...user, adminSchemaPassword: 'true' }

    rerender(<UsersTab />)

    await waitFor(() => {
      expect(toastCalls.includes('it broke')).toBe(true)
    })
  })
})
