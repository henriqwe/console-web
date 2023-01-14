import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { RowActions } from './RowActions'
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
    user
  })
}))

const setSlideType = jest.fn()
const setOpenSlide = jest.fn()

jest.mock('domains/console/UserContext', () => ({
  useUser: () => ({
    reload: false,
    setSlideType,
    setOpenSlide,
    setReload: () => null,
    setSlideData: () => null
  })
}))

describe('RowActions', () => {
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

  it('should render RowActions component', async () => {
    const { container } = render(<RowActions item={{ name: 'name' }} />)

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should handle update action', async () => {
    render(<RowActions item={{ name: 'name' }} />)

    const updateAction = screen.getByTestId('update')
    fireEvent.click(updateAction)

    expect(setOpenSlide).toBeCalledWith(true)
    expect(setSlideType).toBeCalledWith('UPDATEROLE')
  })

  it('should handle delete action', async () => {
    let requestedUrl = ''
    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      requestedUrl = url
    })

    render(<RowActions item={{ name: 'name' }} />)

    const deleteAction = screen.getByTestId('delete')
    fireEvent.click(deleteAction)

    const modalButton = screen.getByText('Delete')
    fireEvent.click(modalButton)

    await waitFor(() => {
      expect(requestedUrl).toBe('v0/id/role/delete')
      expect(toastCalls.includes('Operation performed successfully')).toBe(true)
    })
  })

  it('should break delete action', async () => {
    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      throw new Error('it broke')
    })

    render(<RowActions item={{ name: 'name' }} />)

    const deleteAction = screen.getByTestId('delete')
    fireEvent.click(deleteAction)

    const modalButton = screen.getByText('Delete')
    fireEvent.click(modalButton)

    await waitFor(() => {
      expect(toastCalls.includes('it broke')).toBe(true)
    })
  })
})
