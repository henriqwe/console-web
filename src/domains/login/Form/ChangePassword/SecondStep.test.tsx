import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { SecondStep } from './SecondStep'
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
    api: {
      post: (
        url: string,
        data: {
          userName: string
          passwordRecoveryHash: string
          password: string
        }
      ) => {
        requestedRoute = url
        if (data.passwordRecoveryHash !== 'aaa') {
          throw new Error('test')
        }
        if (url === 'v0/id/account/change-password') {
          return { data: '123' }
        }
        
      }
    }
  }
})

jest.mock('next-auth/react', () => ({
  signIn: async (
    credentials: string,
    data: {
      username: string
      password: string
      redirect: boolean
    }
  ) => {
    return {
      ok: true,
      status: 200
    }
  }
}))

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ test: 100 })
  })
) as jest.Mock

describe('SecondStep', () => {
  afterEach(() => {
    toastCalls = []
  })
  it('should render SecondStep component', () => {
    const { container } = render(
      <SecondStep setRecoverStep={jest.fn()} username="" />
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should go back to the previous step', async () => {
    let step = 1
    render(<SecondStep setRecoverStep={jest.fn(() => {
      step = 0
    })} username="" />)

    const goBackButton = screen.getByText('Go back')

    fireEvent.click(goBackButton)

    await waitFor(() => {
      expect(step).toBe(0)
    })
  })

  it('should break the submit function', async () => {
    render(<SecondStep setRecoverStep={jest.fn()} username="" />)

    const validateButton = screen.getByText('Validate')

    const usernameInput = screen.getByPlaceholderText('Username')
    const passwordInput = screen.getByPlaceholderText('Password')
    const recoverHashInput = screen.getByPlaceholderText('Recover hash')

    fireEvent.change(usernameInput, { target: { value: 'Aleatorio da silva' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })
    fireEvent.change(recoverHashInput, {
      target: { value: 'Aleatorio da silva' }
    })

    fireEvent.click(validateButton)

    await waitFor(() => {
      expect(toastCalls.includes('test')).toBe(true)
    })
  })

  it('should handle the submit function', async () => {
    render(<SecondStep setRecoverStep={jest.fn()} username="" />)

    const validateButton = screen.getByText('Validate')

    const usernameInput = screen.getByPlaceholderText('Username')
    const passwordInput = screen.getByPlaceholderText('Password')
    const recoverHashInput = screen.getByPlaceholderText('Recover hash')

    fireEvent.change(usernameInput, { target: { value: 'Aleatorio da silva' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })
    fireEvent.change(recoverHashInput, {
      target: { value: 'aaa' }
    })

    fireEvent.click(validateButton)

    await waitFor(() => {
      expect(requestedRoute).toBe('v0/id/account/change-password')
      expect(toastCalls.includes('Password changed successfully')).toBe(true)
    })
  })
})

// "jsonwebtoken": "^8.5.1",
