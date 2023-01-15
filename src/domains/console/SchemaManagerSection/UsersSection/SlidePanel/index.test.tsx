import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { UserSlidePanel } from '.'
import '@testing-library/jest-dom'

const mock = function () {
  return {
    observe: jest.fn(),
    disconnect: jest.fn()
  }
}

//--> assign mock directly without jest.fn
window.IntersectionObserver = mock as any

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: (val: string) => {
      mockPush(val)
    },
    query: { name: 'schema1' }
  })
}))

const setOpenSlide = jest.fn()

let slideType = ''
jest.mock('domains/console/UserContext', () => ({
  useUser: () => ({
    setOpenSlide,
    openSlide: true,
    slideType
  })
}))

jest.mock('react-hook-form', () => {
  const hookForm = jest.requireActual('react-hook-form')
  return {
    ...hookForm,
    useForm: () => ({
      ...hookForm.useForm(),
      setValue: jest.fn(),
      reset: jest.fn()
    })
  }
})

describe('UserSlidePanel', () => {
  afterEach(() => {
    slideType = ''
  })

  it('should render UserSlidePanel component', async () => {
    slideType = 'ACCOUNT'
    const { container } = render(<UserSlidePanel />)

    expect(container.firstChild).toBeInTheDocument()
    expect(screen.getByText('Create Account')).toBeInTheDocument()
  })

  it('should render UserSlidePanel component with associate account content', async () => {
    slideType = 'ASSOCIATEACCOUNT'
    const { container } = render(<UserSlidePanel />)

    expect(container.firstChild).toBeInTheDocument()
    expect(screen.getByText('Associate Account')).toBeInTheDocument()
  })

  it('should render UserSlidePanel component with role content', async () => {
    slideType = 'ROLE'
    const { container } = render(<UserSlidePanel />)

    expect(container.firstChild).toBeInTheDocument()
    expect(screen.getByText('Create Role')).toBeInTheDocument()
  })

  it('should render UserSlidePanel component with admin login content', async () => {
    slideType = 'ADMINLOGIN'
    const { container } = render(<UserSlidePanel />)

    expect(container.firstChild).toBeInTheDocument()
    expect(screen.getByText('Authorization')).toBeInTheDocument()
  })

  it('should render UserSlidePanel component with update account content', async () => {
    slideType = 'UPDATEACCOUNT'
    const { container } = render(<UserSlidePanel />)

    expect(container.firstChild).toBeInTheDocument()
    expect(screen.getByText('Update Account')).toBeInTheDocument()
  })

  it('should render UserSlidePanel component with update role content', async () => {
    slideType = 'UPDATEROLE'
    const { container } = render(<UserSlidePanel />)

    expect(container.firstChild).toBeInTheDocument()
    expect(screen.getByText('Update role')).toBeInTheDocument()
  })
})
