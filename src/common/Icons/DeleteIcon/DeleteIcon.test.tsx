import { render } from '@testing-library/react'
import { DeleteIcon } from '.'
import '@testing-library/jest-dom'

describe('DeleteIcon', () => {
  it('should render the DeleteIcon', () => {
    const { container } = render(<DeleteIcon data-testid="test1" />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
