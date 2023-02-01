import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ChangePassword } from '.'
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
    }
  })
}))

let requestedRoute = ''
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
      get: (
        url: string,
        data: {
          name: string
          username: string
          password: string
          email: string
        }
      ) => {
        requestedRoute = url
        return 'response'
      }
    }
  }
})

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ test: 100 })
  })
) as jest.Mock

describe('ChangePassword', () => {
  afterEach(() => {
    toastCalls = []
  })

  it('should render ChangePassword component at the first step', () => {
    const { container } = render(<ChangePassword />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render ChangePassword component at the second step', async () => {
    render(<ChangePassword />)

    const registerButton = screen.getByText('Confirm')

    const usernameInput = screen.getByPlaceholderText('Username')

    fireEvent.change(usernameInput, { target: { value: 'Aleatorio da silva' } })

    fireEvent.click(registerButton)

    await waitFor(() => {
      expect(screen.getByText('Validate')).toBeInTheDocument()
    })
  })
})

// "jsonwebtoken": "^8.5.1",
