import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { RoleTab } from '.'
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
let roles = [{ name: 'role1', status: 0 }]
jest.mock('domains/console/UserContext', () => ({
  useUser: () => ({
    reload: false,
    setSlideType,
    setOpenSlide,
    setRoles: () => null,
    roles
  })
}))

describe('RoleTab', () => {
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

  it('should render RoleTab component', async () => {
    let requestedUrl = ''
    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      requestedUrl = url
      return [{ name: 'role1' }]
    })
    const { container } = render(<RoleTab />)

    const loadingMessage = screen.getByText('Loading entity data')
    expect(loadingMessage).toBeInTheDocument()

    await waitFor(() => {
      expect(requestedUrl).toBe('v0/id/role/get-all')
      expect(container.firstChild).toBeInTheDocument()
      expect(loadingMessage).not.toBeInTheDocument()
    })
  })

  it('should render RoleTab component without authorization', async () => {
    user = { ...user, adminSchemaPassword: undefined }

    render(<RoleTab />)

    const authorizationButton = screen.getByText('Authorization')
    fireEvent.click(authorizationButton)

    expect(setSlideType).toBeCalledWith('ADMINLOGIN')
    expect(setOpenSlide).toBeCalledWith(true)
  })

  it('should open modal to create a new role', async () => {
    roles = [{ name: 'role1', status: 1 }]
    let requestedUrl = ''
    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      requestedUrl = url
      return [{ name: 'role1' }]
    })
    const { container, rerender } = render(<RoleTab />)

    expect(container.firstChild).toHaveClass('items-center justify-center')

    const loadingMessage = screen.getByText('Loading entity data')
    expect(loadingMessage).toBeInTheDocument()

    await waitFor(() => {
      expect(requestedUrl).toBe('v0/id/role/get-all')
      expect(container.firstChild).toBeInTheDocument()

      expect(loadingMessage).not.toBeInTheDocument()
    })

    const createButton = screen.getByText('Create')
    fireEvent.click(createButton)

    expect(setSlideType).toBeCalledWith('ROLE')
    expect(setOpenSlide).toBeCalledWith(true)

    roles = [{ name: 'role1', status: 2 }]

    rerender(<RoleTab />)
  })

  it('should break submit action', async () => {
    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      throw { response: { status: 400, message: 'it broke' } }
    })
    const { rerender } = render(<RoleTab />)

    await waitFor(() => {
      expect(toastCalls.includes('it broke')).not.toBe(true)
    })

    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      throw { response: { status: 500 }, message: 'it broke' }
    })

    user = { ...user, adminSchemaPassword: 'true' }

    rerender(<RoleTab />)

    await waitFor(() => {
      expect(toastCalls.includes('it broke')).toBe(true)
    })
  })
})
