import { render } from '@testing-library/react'
import { Empty } from '.'
import '@testing-library/jest-dom'

describe('Empty', () => {
  it('should render the Empty illustration', () => {
    const { container } = render(<Empty data-testid="test1" />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
