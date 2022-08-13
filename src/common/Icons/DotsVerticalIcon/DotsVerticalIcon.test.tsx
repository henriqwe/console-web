import { render } from '@testing-library/react'
import { DotsVerticalIcon } from '.'
import '@testing-library/jest-dom'

describe('XIcon', () => {
  it('should render the XIcon', () => {
    const { container } = render(<DotsVerticalIcon data-testid="test1" />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
