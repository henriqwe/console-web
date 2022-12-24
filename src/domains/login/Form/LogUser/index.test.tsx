import { render } from '@testing-library/react'
import { LogUser } from '.'
import '@testing-library/jest-dom'

describe('BetaTag', () => {
  it('should render LogUser component', () => {
    const { container } = render(<LogUser />)
    expect(container.firstChild).toBeInTheDocument()
  })
})

// "@hookform/resolvers": "^2.9.1",