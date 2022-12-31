import { render, screen } from '@testing-library/react'
import { LoginProvider, useLogin } from './LoginContext'
import '@testing-library/jest-dom'

describe('AuthLayout', () => {
  it('should render AuthLayout component', () => {
    const TestComponent = () => {
      const { formType } = useLogin()
      return <div>{formType}</div>
    }

    const { container } = render(
      <LoginProvider>
        <TestComponent />
      </LoginProvider>
    )
    expect(container.firstChild).toBeInTheDocument()
    expect(screen.getByText('login')).toBeInTheDocument()
  })
})
