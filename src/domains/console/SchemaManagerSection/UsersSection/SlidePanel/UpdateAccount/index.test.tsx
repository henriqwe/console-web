import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { UpdateAccount } from '.'
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

jest.mock('react-hook-form', () => {
const hookForm = jest.requireActual('react-hook-form')
  return {
    ...hookForm,
  useForm: () => ({
    ...hookForm.useForm(),
    setValue: jest.fn()
  })
  }
  
})

let roles = [{ name: 'role1', status: 0 }] as any
let selectedUser = {
  createdAt: 0,
  email: 'string',
  id: 'string',
  name: 'string',
  oldPassword: 'string',
  password: 'string',
  roles: [{ name: 'role1', status: 0 }],
  status: 0 | 1,
  updatedAt: 0,
  username: 'string',
  version: 0
} as any
jest.mock('domains/console/UserContext', () => ({
  useUser: () => ({
    setOpenSlide,
    roles,
    reload: false,
    setReload: () => null,
    selectedUser
  })
}))

describe('UpdateAccount', () => {
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
    selectedUser = {
      createdAt: 0,
      email: 'string',
      id: 'string',
      name: 'string',
      oldPassword: 'string',
      password: 'string',
      roles: [{ name: 'role1', status: 0 }],
      status: 0,
      updatedAt: 0,
      username: 'string',
      version: 0
    }
  })

  it('should render UpdateAccount component', async () => {
    roles = undefined
    selectedUser = undefined
    const { container } = render(<UpdateAccount />)

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should handle submit action', async () => {
    let requestedUrl: string
    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      requestedUrl = url
      return { data: [{ name: 'role1', status: 0 }] }
    })
    render(<UpdateAccount />)

    const usernameInput = screen.getByPlaceholderText('Username')
    fireEvent.change(usernameInput, { target: { value: 'aleatorio' } })

    const emailInput = screen.getByPlaceholderText('E-mail')
    fireEvent.change(emailInput, { target: { value: 'aleatorio@random.com' } })

    const rolesMultiSelect = screen.getAllByText('Roles')
    fireEvent.click(rolesMultiSelect[1])

    const roleOption = screen.getByText('role1')
    fireEvent.click(roleOption)

    const submitButton = screen.getByText('Update')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(requestedUrl).toBe('v0/id/account/update')
      expect(toastCalls.includes('Operation performed successfully')).toBe(true)
    })
  })

  it('should break submit action', async () => {
    selectedUser = {...selectedUser, status: 1}
    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      throw new Error('it broke')
    })

     render(<UpdateAccount />)

    const usernameInput = screen.getByPlaceholderText('Username')
    fireEvent.change(usernameInput, { target: { value: 'aleatorio' } })

    const emailInput = screen.getByPlaceholderText('E-mail')
    fireEvent.change(emailInput, { target: { value: 'aleatorio@random.com' } })

    const submitButton = screen.getByText('Update')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(toastCalls.includes('it broke')).toBe(true)
    })
  })
})
