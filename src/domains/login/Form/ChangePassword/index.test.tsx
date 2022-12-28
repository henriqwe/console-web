import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
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

describe('ChangePassword', () => {
  afterEach(() => {
    toastCalls = []
  })
  it('should render ChangePassword component', () => {
    const { container } = render(<ChangePassword />)
    expect(container.firstChild).toBeInTheDocument()
  })

})

// "jsonwebtoken": "^8.5.1",
