import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CreateUser } from '.'
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

jest.mock('next-auth/react', () => ({
  signIn: async (
    credentials: string,
    data: {
      username: string
      password: string
      redirect: boolean
    }
  ) => {
    if (data.username === 'break') {
      throw { response: { status: 417, message: 'Break' } }
    }
    if (data.username === 'breakUnknown') {
      throw new Error('break')
    }
    if (data.username === 'Aleatorio') {
      return {
        ok: false,
        status: 200
      }
    }

    return {
      ok: true,
      status: 200
    }
  }
}))

let pushedRouter = ''
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: (val: string) => {
      pushedRouter = val
    }
  })
}))

jest.mock('utils/api', () => {
  return {
    ...jest.requireActual('utils/api'),
    localApi: {
      post: (
        url: string,
        data: {
          name: string
          username: string
          password: string
          email: string
        }
      ) => {
        if (url === '/pagarme/customers/create') {
          return { data: '123' }
        }
        if (url === '/getUserToken') {
          return { data: '123' }
        }
      }
    },
    api: {
      post: (
        url: string,
        data: {
          name: string
          username: string
          password: string
          email: string
        }
      ) => {
        if (url === '/pagarme/customers/create') {
          return { data: '123' }
        }
        if (url === '/getUserToken') {
          return { data: '123' }
        }
      }
    }
  }
})

jest.mock('contexts/PixelContext', () => ({
  usePixel: () => ({
    pixel: {
      track: () => null
    }
  })
}))

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ test: 100 })
  })
) as jest.Mock

describe('CreateUser', () => {
  afterEach(() => {
    toastCalls = []
  })
  it('should render CreateUser component', () => {
    const { container } = render(<CreateUser />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should not handle submit action because of empty inputs', async () => {
    const { container } = render(<CreateUser />)
    expect(container.firstChild).toBeInTheDocument()

    const registerButton = screen.getByText('Register')
    fireEvent.click(registerButton)

    await waitFor(() => {
      const nameErrorMessage = screen.getByText('Name is required')
      const usernameErrorMessage = screen.getByText('Username is required')
      const emailErrorMessage = screen.getByText('Email is required')
      const passwordErrorMessage = screen.getByText('Password is required')
      expect(nameErrorMessage).toBeInTheDocument()
      expect(usernameErrorMessage).toBeInTheDocument()
      expect(emailErrorMessage).toBeInTheDocument()
      expect(passwordErrorMessage).toBeInTheDocument()
    })
  })

  it('should not handle submit action because of user name contains space', async () => {
    const { container } = render(<CreateUser />)
    expect(container.firstChild).toBeInTheDocument()

    const registerButton = screen.getByText('Register')

    const usernameInput = screen.getByPlaceholderText('Username')
    const passwordInput = screen.getByPlaceholderText('Password')

    fireEvent.change(usernameInput, { target: { value: 'Aleatorio da silva' } })
    fireEvent.change(passwordInput, { target: { value: '12345' } })

    fireEvent.click(registerButton)

    await waitFor(() => {
      const usernameErrorMessage = screen.getByText(
        'This field cannot contain spaces'
      )
      expect(usernameErrorMessage).toBeInTheDocument()
    })
  })

  it('should not handle submit action because of user name contains numbers', async () => {
    const { container } = render(<CreateUser />)
    expect(container.firstChild).toBeInTheDocument()

    const registerButton = screen.getByText('Register')

    const usernameInput = screen.getByPlaceholderText('Username')
    const passwordInput = screen.getByPlaceholderText('Password')

    fireEvent.change(usernameInput, { target: { value: 'Aleatorio123' } })
    fireEvent.change(passwordInput, { target: { value: '12345' } })

    fireEvent.click(registerButton)

    await waitFor(() => {
      const usernameErrorMessage = screen.getByText(
        'This field must contain only letters'
      )
      expect(usernameErrorMessage).toBeInTheDocument()
    })
  })

  it('should handle submit action with user existent error', async () => {
    const { container } = render(<CreateUser />)
    expect(container.firstChild).toBeInTheDocument()

    const nameInput = screen.getByPlaceholderText('Full name')
    const usernameInput = screen.getByPlaceholderText('Username')
    const emailInput = screen.getByPlaceholderText('E-mail')
    const passwordInput = screen.getByPlaceholderText('Password')

    fireEvent.change(nameInput, { target: { value: 'break' } })
    fireEvent.change(usernameInput, { target: { value: 'break' } })
    fireEvent.change(emailInput, { target: { value: 'email@email.com' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })

    const registerButton = screen.getByText('Register')
    fireEvent.click(registerButton)

    await waitFor(() => {
      expect(toastCalls.includes('Username already exists')).toBe(true)
    })
  })

  it('should handle submit action with unkwown error', async () => {
    const { container } = render(<CreateUser />)
    expect(container.firstChild).toBeInTheDocument()

    const nameInput = screen.getByPlaceholderText('Full name')
    const usernameInput = screen.getByPlaceholderText('Username')
    const emailInput = screen.getByPlaceholderText('E-mail')
    const passwordInput = screen.getByPlaceholderText('Password')

    fireEvent.change(nameInput, { target: { value: 'break' } })
    fireEvent.change(usernameInput, { target: { value: 'breakUnknown' } })
    fireEvent.change(emailInput, { target: { value: 'email@email.com' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })

    const registerButton = screen.getByText('Register')
    fireEvent.click(registerButton)

    await waitFor(() => {
      expect(toastCalls.includes('break')).toBe(true)
    })
  })

  it('should handle submit action with correct user but without ok status', async () => {
    const { container } = render(<CreateUser />)
    expect(container.firstChild).toBeInTheDocument()

    const nameInput = screen.getByPlaceholderText('Full name')
    const usernameInput = screen.getByPlaceholderText('Username')
    const emailInput = screen.getByPlaceholderText('E-mail')
    const passwordInput = screen.getByPlaceholderText('Password')

    fireEvent.change(nameInput, { target: { value: 'Aleatório de Souza' } })
    fireEvent.change(usernameInput, { target: { value: 'Aleatorio' } })
    fireEvent.change(emailInput, { target: { value: 'email@email.com' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })

    const registerButton = screen.getByText('Register')

    fireEvent.click(registerButton)

    await waitFor(() => {
      expect(pushedRouter).toBe('/')
    })
  })

  it('should handle submit action with correct user', async () => {
    const { container } = render(<CreateUser />)
    expect(container.firstChild).toBeInTheDocument()

    const nameInput = screen.getByPlaceholderText('Full name')
    const usernameInput = screen.getByPlaceholderText('Username')
    const emailInput = screen.getByPlaceholderText('E-mail')
    const passwordInput = screen.getByPlaceholderText('Password')

    fireEvent.change(nameInput, { target: { value: 'Aleatório de Souza' } })
    fireEvent.change(usernameInput, { target: { value: 'AleatorioDeSouza' } })
    fireEvent.change(emailInput, { target: { value: 'email@email.com' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })

    const registerButton = screen.getByText('Register')

    fireEvent.click(registerButton)

    await waitFor(() => {
      expect(pushedRouter).toBe('/')
    })
  })
})

// "jsonwebtoken": "^8.5.1",
