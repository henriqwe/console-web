import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { AdminLogin } from '.'
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
const setRoles = jest.fn()

jest.mock('domains/console/UserContext', () => ({
  useUser: () => ({
    setRoles,
    setOpenSlide
  })
}))

describe('AdminLogin', () => {
  afterEach(() => {
    toastCalls = []
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

  it('should render AdminLogin component', async () => {
    const { container } = render(<AdminLogin />)

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should handle submit action', async () => {
    let requestedUrl = ''
    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      requestedUrl = url
      return { data: [{ name: 'role1', status: 0 }] }
    })
    render(<AdminLogin />)

    const passwordInput = screen.getByPlaceholderText('Password')

    fireEvent.change(passwordInput, { target: { value: '12345' } })

    const submitButton = screen.getByText('access')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(requestedUrl).toBe('v0/id/role/get-all')
      expect(toastCalls.includes('Authorized')).toBe(true)
    })
  })

  it('should break submit action', async () => {
    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      throw new Error('it broke')
    })

    render(<AdminLogin />)

    const passwordInput = screen.getByPlaceholderText('Password')

    fireEvent.change(passwordInput, { target: { value: '12345' } })

    const submitButton = screen.getByText('access')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(toastCalls.includes('it broke')).toBe(true)
    })
  })
})
