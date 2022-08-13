import { render } from '@testing-library/react'
import { ConsoleIcon } from '.'
import '@testing-library/jest-dom'

describe('ConsoleIcon', () => {
  it('should render the ConsoleIcon', () => {
    const { container } = render(<ConsoleIcon data-testid="test1" />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
