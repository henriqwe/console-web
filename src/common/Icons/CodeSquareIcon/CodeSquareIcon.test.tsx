import { render } from '@testing-library/react'
import { CodeSquareIcon } from '.'
import '@testing-library/jest-dom'

describe('CodeSquareIcon', () => {
  it('should render the CodeSquareIcon', () => {
    const { container } = render(<CodeSquareIcon data-testid="test1" />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
