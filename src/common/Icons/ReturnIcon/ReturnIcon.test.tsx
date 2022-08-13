import { render } from '@testing-library/react'
import { ReturnIcon } from '.'
import '@testing-library/jest-dom'

describe('ReturnIcon', () => {
  it('should render the ReturnIcon', () => {
    const { container } = render(<ReturnIcon data-testid="test1" />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
