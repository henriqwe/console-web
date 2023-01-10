import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { AdminLogin } from '.'
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

let pushedRouter = ''
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: (val: string) => {
      pushedRouter = val
    },
    query: { name: 'schema1' }
  })
}))

let cookiesSetted: string[] = []
jest.mock('utils/cookies', () => {
  return {
    setCookie: (name: string, val: string) => cookiesSetted.push(val)
  }
})

let urlPushed = ''
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
        urlPushed = url
        if (data.username === 'break') {
          throw new Error('it broke')
        }

        if (data.username === 'incorrect') {
          throw { response: { status: 401 } }
        }
        return {
          data: {
            data: {
              username: 'test',
              access_token: '123'
            }
          }
        }
      }
    }
  }
})

describe('AdminLogin', () => {
  afterEach(() => {
    toastCalls = []
    pushedRouter = ''
    cookiesSetted = []
    urlPushed = ''
  })
  it('should render AdminLogin component', () => {
    const { container } = render(<AdminLogin />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should handle the submit function', async () => {
    const { container } = render(<AdminLogin />)

    const userNameInput = screen.getByPlaceholderText('User name')
    fireEvent.change(userNameInput, { target: { value: 'Aleatorio' } })

    const passwordInput = screen.getByPlaceholderText('Password')
    fireEvent.change(passwordInput, { target: { value: '123456' } })

    const loginButton = screen.getByText('Log in')
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(urlPushed).toBe('/adminLogin')
      expect(toastCalls.includes('Login successfully')).toBe(true)
      expect(cookiesSetted.includes('test')).toBe(true)
      expect(cookiesSetted.includes('123')).toBe(true)
      expect(pushedRouter).toBe('/console/schema1')
    })
  })

  it('should break the submit function', async () => {
    render(<AdminLogin />)

    const userNameInput = screen.getByPlaceholderText('User name')
    fireEvent.change(userNameInput, { target: { value: 'break' } })

    const passwordInput = screen.getByPlaceholderText('Password')
    fireEvent.change(passwordInput, { target: { value: '123456' } })

    const loginButton = screen.getByText('Log in')
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(toastCalls.includes('it broke')).toBe(true)
    })
  })

  it('should break the submit function because of wrong user', async () => {
    render(<AdminLogin />)

    const userNameInput = screen.getByPlaceholderText('User name')
    fireEvent.change(userNameInput, { target: { value: 'incorrect' } })

    const passwordInput = screen.getByPlaceholderText('Password')
    fireEvent.change(passwordInput, { target: { value: '123456' } })

    const loginButton = screen.getByText('Log in')
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(toastCalls.includes('Ops! Incorrect username or password')).toBe(
        true
      )
    })
  })

  it('should go back to dashboard', async () => {
    render(<AdminLogin />)

    const backButton = screen.getByText('Back to dashboard')
    fireEvent.click(backButton)

    expect(pushedRouter).toBe('/')
  })
})
