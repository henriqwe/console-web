import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { LogUser } from '.'
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
    if (data.username === 'AleatorioDeSouza' && data.password === '12345') {
      return {
        ok: true,
        status: 200
      }
    }

    if (data.username === 'break') {
      return {
        ok: false,
        status: 500
      }
    }
    return {
      ok: false,
      status: 401
    }
  }
}))

let pushedRouter = ''
jest.mock('next/router', () => ({
  push: (val: string) => {
    pushedRouter = val
  }
}))

describe('BetaTag', () => {
  afterEach(() => {
    toastCalls = []
  })
  it('should render LogUser component', () => {
    const { container } = render(<LogUser />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should not handle submit action because of empty inputs', async () => {
    const { container } = render(<LogUser />)
    expect(container.firstChild).toBeInTheDocument()

    const loginButton = screen.getByText('Login')
    fireEvent.click(loginButton)

    await waitFor(() => {
      const usernameErrorMessage = screen.getByText(
        'Username field is required'
      )
      const passwordErrorMessage = screen.getByText(
        'Password field is required'
      )
      expect(usernameErrorMessage).toBeInTheDocument()
      expect(passwordErrorMessage).toBeInTheDocument()
    })
  })

  it('should not handle submit action because of user name contains space', async () => {
    const { container } = render(<LogUser />)
    expect(container.firstChild).toBeInTheDocument()

    const loginButton = screen.getByText('Login')

    const usernameInput = screen.getByPlaceholderText('Username')
    const passwordInput = screen.getByPlaceholderText('Password')

    fireEvent.change(usernameInput, { target: { value: 'Aleatorio da silva' } })
    fireEvent.change(passwordInput, { target: { value: '12345' } })

    fireEvent.click(loginButton)

    await waitFor(() => {
      const usernameErrorMessage = screen.getByText(
        'This field cannot contain spaces'
      )
      expect(usernameErrorMessage).toBeInTheDocument()
    })
  })

  it('should not handle submit action because of user name contains numbers', async () => {
    const { container } = render(<LogUser />)
    expect(container.firstChild).toBeInTheDocument()

    const loginButton = screen.getByText('Login')

    const usernameInput = screen.getByPlaceholderText('Username')
    const passwordInput = screen.getByPlaceholderText('Password')

    fireEvent.change(usernameInput, { target: { value: 'Aleatorio123' } })
    fireEvent.change(passwordInput, { target: { value: '12345' } })

    fireEvent.click(loginButton)

    await waitFor(() => {
      const usernameErrorMessage = screen.getByText(
        'This field must contain only letters'
      )
      expect(usernameErrorMessage).toBeInTheDocument()
    })
  })

  it('should handle submit action with wrong password and user name', async () => {
    const { container } = render(<LogUser />)
    expect(container.firstChild).toBeInTheDocument()

    const usernameInput = screen.getByPlaceholderText('Username')
    const passwordInput = screen.getByPlaceholderText('Password')

    fireEvent.change(usernameInput, { target: { value: 'AleatorioDaSilva' } })
    fireEvent.change(passwordInput, { target: { value: '12345' } })

    const loginButton = screen.getByText('Login')
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(toastCalls.includes('Ops! Incorrect username or password')).toBe(
        true
      )
    })
  })

  it('should handle submit action with unkwown error', async () => {
    const { container } = render(<LogUser />)
    expect(container.firstChild).toBeInTheDocument()

    const usernameInput = screen.getByPlaceholderText('Username')
    const passwordInput = screen.getByPlaceholderText('Password')

    fireEvent.change(usernameInput, { target: { value: 'break' } })
    fireEvent.change(passwordInput, { target: { value: '12345' } })

    const loginButton = screen.getByText('Login')
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(toastCalls.includes('Ops! Something went wrong')).toBe(true)
    })
  })

  it('should handle submit action with correct user', async () => {
    const { container } = render(<LogUser />)
    expect(container.firstChild).toBeInTheDocument()

    const usernameInput = screen.getByPlaceholderText('Username')
    const passwordInput = screen.getByPlaceholderText('Password')

    fireEvent.change(usernameInput, { target: { value: 'AleatorioDeSouza' } })
    fireEvent.change(passwordInput, { target: { value: '12345' } })

    const loginButton = screen.getByText('Login')
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(pushedRouter).toBe('/')
    })
  })
})

// "jsonwebtoken": "^8.5.1",
