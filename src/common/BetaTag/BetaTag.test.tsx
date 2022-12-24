import { render } from '@testing-library/react'
import { BetaTag } from '.'
import '@testing-library/jest-dom'

describe('BetaTag', () => {
  it('should render BetaTag component', () => {
    const { container } = render(<BetaTag />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
