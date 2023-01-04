import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ViewAdminUser } from '.'
import '@testing-library/jest-dom'

window.prompt = jest.fn()

let itShouldBreak = false
jest.mock('utils/api', () => ({
  api: {
    delete: (url: string, config: any) => {
      if (itShouldBreak) {
        throw { response: { data: { message: 'It broke' } } }
      }
      return
    }
  }
}))

let pushedRoutes: string[] = []
jest.mock('next/router', () => ({
  useRouter: () => {
    return {
      asPath: '/',
      push: (val: string) => {
        if (itShouldBreak) {
          throw new Error('It broke')
        }
        pushedRoutes.push(val)
      }
    }
  }
}))

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

jest.mock('utils/cookies', () => {
  return {
    getCookie: () => '123'
  }
})

jest.mock('domains/dashboard/DashboardContext', () => ({
  ...jest.requireActual('domains/dashboard/DashboardContext'),
  useData: () => ({
    createdSchemaName: 'schema',
    adminUser: { username: '123', password: '321' }
  })
}))

Object.assign(navigator, {
  clipboard: {
    writeText: () => {}
  }
})

const mock = function () {
  return {
    observe: jest.fn(),
    disconnect: jest.fn()
  }
}

//--> assign mock directly without jest.fn
window.IntersectionObserver = mock as any

describe('ViewAdminUser', () => {
  const originalClipboard = { ...global.navigator.clipboard }

  beforeEach(() => {
    const mockClipboard = {
      writeText: jest.fn()
    }
    global.navigator.clipboard = mockClipboard
  })

  afterEach(() => {
    global.navigator.clipboard = originalClipboard
  })

  afterEach(() => {
    pushedRoutes = []
    toastCalls = []
  })
  it('should render ViewAdminUser component', async () => {
    const { container } = render(<ViewAdminUser />)

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should handle the delete schema action', async () => {
    render(<ViewAdminUser />)

    const checkbox = screen.getByRole('checkbox')

    fireEvent.click(checkbox)

    const concludeButton = screen.getByText('Conclude')

    fireEvent.click(concludeButton)

    await waitFor(() => {
      expect(pushedRoutes.includes('/console/schema')).toBe(true)
    })
  })

  it('should break the delete schema action', async () => {
    itShouldBreak = true
    render(<ViewAdminUser />)

    const checkbox = screen.getByRole('checkbox')

    fireEvent.click(checkbox)

    const concludeButton = screen.getByText('Conclude')

    fireEvent.click(concludeButton)

    await waitFor(() => {
      expect(toastCalls.includes('It broke')).toBe(true)
    })
  })

  it('should copy the admin username and password to clipboard', async () => {
    render(<ViewAdminUser />)

    const usernameButton = screen.getByTestId('username')

    fireEvent.click(usernameButton)

    expect(navigator.clipboard.writeText).toBeCalledWith('123')

    const passwordButton = screen.getByTestId('password')

    fireEvent.click(passwordButton)

    expect(navigator.clipboard.writeText).toBeCalledWith('321')
    expect(toastCalls.includes('Copied to clipboard')).toBe(true)
  })
})
