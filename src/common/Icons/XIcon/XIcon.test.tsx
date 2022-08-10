import { render } from '@testing-library/react'
import { XIcon } from '.'
import '@testing-library/jest-dom'

describe('XIcon', () => {
  it('should render the XIcon', () => {
    const { container } = render(<XIcon data-testid="test1" />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
