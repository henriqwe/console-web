import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { AssociateAccount } from '.'
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

describe('AssociateAccount', () => {
  afterEach(() => {
    toastCalls = []
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
    roles = undefined
    const { container } = render(<AssociateAccount />)

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should handle submit action', async () => {
    let requestedUrl = ''
    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      requestedUrl = url
      return { data: [{ name: 'role1', status: 0 }] }
    })
    render(<AssociateAccount />)

    const usernameInput = screen.getByPlaceholderText('User name')

    fireEvent.change(usernameInput, { target: { value: 'aleatorio' } })

    const submitButton = screen.getByText('Create')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(requestedUrl).toBe('v0/id/account/update')
      expect(toastCalls.includes('User created successfully')).toBe(true)
    })
  })

  it('should break submit action', async () => {
    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      throw new Error('it broke')
    })

    const { rerender } = render(<AssociateAccount />)

    const usernameInput = screen.getByPlaceholderText('User name')

    fireEvent.change(usernameInput, { target: { value: 'aleatorio' } })

    const rolesSelect = screen.getAllByText('Roles')

    fireEvent.click(rolesSelect[1])

    const roleOption = screen.getByText('role1')
    fireEvent.click(roleOption)

    const submitButton = screen.getByText('Create')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(toastCalls.includes('it broke')).toBe(true)
    })

    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      throw { response: { data: { message: 'broken message' } } }
    })
    rerender(<AssociateAccount />)

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(toastCalls.includes('broken message')).toBe(true)
    })
  })
})
