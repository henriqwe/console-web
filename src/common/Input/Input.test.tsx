import { render, screen } from '@testing-library/react'
import { Input } from '.'
import '@testing-library/jest-dom'

describe('Input', () => {
  it('should render the Input', () => {
    const { container } = render(<Input data-testid="test1" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render the Input with the correct label', () => {
    render(<Input label="inputTest" />)
    const inputLabel = screen.getByText('inputTest')
    expect(inputLabel).toBeInTheDocument()
  })

  it('should render the Input with an error message', () => {
    render(<Input label="inputTest" errors={{ message: 'test error' }} />)
    const inputError = screen.getByText('test error')
    expect(inputError).toBeInTheDocument()
  })

  it('should render the Input with an icon', () => {
    const { container } = render(<Input label="inputTest" icon={'icon'} />)
    const icon = screen.getByText('icon')
    const input = container.querySelector('#inputTest')
    expect(icon).toBeInTheDocument()
    expect(input).toHaveClass('rounded-r-md')
  })
})
