import { render, screen } from '@testing-library/react'
import { Alert } from '.'
import '@testing-library/jest-dom'

describe('Alert', () => {
  it('should render Alert component', () => {
    const { container } = render(<Alert>Test</Alert>)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render Alert component with correct title', () => {
    render(<Alert title="Test alert">Test</Alert>)
    const alertTitle = screen.getByText('Test alert')
    expect(alertTitle).toBeInTheDocument()
  })

  it('should render Alert component with all themes', () => {
    const { container, rerender } = render(<Alert theme="info">Test</Alert>)

    expect(container.firstChild).toHaveClass(
      '!border-teal-500  text-teal-900 bg-teal-100'
    )

    rerender(<Alert theme="warning">Test</Alert>)
    expect(container.firstChild).toHaveClass(
      '!border-yellow-500 text-yellow-900 bg-yellow-100'
    )

    rerender(<Alert theme="danger">Test</Alert>)
    expect(container.firstChild).toHaveClass(
      '!border-red-500 text-red-900 bg-red-100'
    )
  })
})
