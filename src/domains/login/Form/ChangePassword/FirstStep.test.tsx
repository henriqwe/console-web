import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { FirstStep } from './FirstStep'
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

describe('FirstStep', () => {
  afterEach(() => {
    toastCalls = []
  })
  it('should render FirstStep component', () => {
    const { container } = render(
      <FirstStep setRecoverStep={jest.fn()} setUsername={jest.fn()} />
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should go back to login page', async () => {
    render(
      <FirstStep
        setRecoverStep={jest.fn()}
        setUsername={jest.fn()}
      />
    )

    const goBackButton = screen.getByText('Go back')

    fireEvent.click(goBackButton)

    await waitFor(() => {
      expect(pushedRouter).toBe('/login')
    })
  })

  it('should break the submit function', async () => {
    render(
      <FirstStep
        setRecoverStep={jest.fn(() => {
          throw new Error('test')
        })}
        setUsername={jest.fn()}
      />
    )

    const registerButton = screen.getByText('Confirm')

    const usernameInput = screen.getByPlaceholderText('Username')

    fireEvent.change(usernameInput, { target: { value: 'Aleatorio da silva' } })

    fireEvent.click(registerButton)

    await waitFor(() => {
      expect(requestedRoute).toBe(
        'v0/id/account/recovery-password/Aleatorio da silva'
      )
      expect(toastCalls.includes('test')).toBe(true)
    })
  })

  it('should handle the submit function', async () => {
    render(<FirstStep setRecoverStep={jest.fn()} setUsername={jest.fn()} />)

    const registerButton = screen.getByText('Confirm')

    const usernameInput = screen.getByPlaceholderText('Username')

    fireEvent.change(usernameInput, { target: { value: 'Aleatorio da silva' } })

    fireEvent.click(registerButton)

    await waitFor(() => {
      expect(requestedRoute).toBe(
        'v0/id/account/recovery-password/Aleatorio da silva'
      )
      expect(toastCalls.includes('User found! check your email account')).toBe(
        true
      )
    })
  })
})

// "jsonwebtoken": "^8.5.1",
