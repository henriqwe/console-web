import { render, screen } from '@testing-library/react'
import { AuthLayout } from './AuthLayout'
import '@testing-library/jest-dom'

let isDark = false
jest.mock('contexts/ThemeContext', () => ({
  useTheme: () => ({
    isDark
  })
}))

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: ''
    }
  }
}))

const useRouter = jest.spyOn(require('next/router'), 'useRouter')
const useTheme = jest.spyOn(require('contexts/ThemeContext'), 'useTheme')

describe('AuthLayout', () => {
  it('should render AuthLayout component', () => {
    const { container } = render(
      <AuthLayout>
        <div />
      </AuthLayout>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render AuthLayout component with dark state', () => {
    isDark = true
    const { container } = render(
      <AuthLayout>
        <div />
      </AuthLayout>
    )

    const logoImg = screen.getByTestId('Logo')

    expect(logoImg).toHaveAttribute('src', '/assets/images/logoTextLight.png')
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render AuthLayout in the login page', () => {
    useRouter.mockImplementation(() => ({
      pathname: '/login'
    }))

    const { container } = render(
      <AuthLayout>
        <div />
      </AuthLayout>
    )

    const message = screen.getByText("Don't have an account?")
    const linkMessage = screen.getByText('Sign up!')

    expect(message).toBeInTheDocument()
    expect(linkMessage).toBeInTheDocument()
    expect(container.firstChild).toBeInTheDocument()
  })
})
