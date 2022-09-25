import { render, screen } from '@testing-library/react'
import { Textarea } from '.'
import '@testing-library/jest-dom'

describe('Textarea', () => {
  it('should render the Textarea', () => {
    const { container } = render(<Textarea data-testid="test1" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render the Textarea with the correct label', () => {
    render(<Textarea label="TextareaTest" />)
    const TextareaLabel = screen.getByText('TextareaTest')
    expect(TextareaLabel).toBeInTheDocument()
  })

  it('should render the Textarea with an error message', () => {
    render(<Textarea label="TextareaTest" errors={{ message: 'test error' }} />)
    const TextareaError = screen.getByText('test error')
    expect(TextareaError).toBeInTheDocument()
  })

  it('should render the Textarea with an icon', () => {
    const { container } = render(
      <Textarea label="TextareaTest" icon={'icon'} />
    )
    const icon = screen.getByText('icon')
    const textarea = container.querySelector('#TextareaTest')
    expect(icon).toBeInTheDocument()
    expect(textarea).toHaveClass('rounded-r-md')
  })
})
