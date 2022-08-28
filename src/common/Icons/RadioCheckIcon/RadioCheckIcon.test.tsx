import { render } from '@testing-library/react'
import { RadioCheckIcon } from '.'
import '@testing-library/jest-dom'

describe('RadioCheckIcon', () => {
  it('should render the RadioCheckIcon checked', () => {
    const { container } = render(<RadioCheckIcon data-testid="test1" checked />)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild?.firstChild).toHaveClass(
      'flex items-center justify-center w-4 h-4 rounded-full bg-blue-500  text-white'
    )
  })

  it('should render the RadioCheckIcon unchecked', () => {
    const { container } = render(
      <RadioCheckIcon data-testid="test1" checked={false} />
    )
    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild?.firstChild).toHaveClass(
      'flex items-center justify-center w-4 h-4 rounded-full border border-gray-500 text-gray-500 dark:border-gray-300 dark:text-gray-300'
    )
  })
})
