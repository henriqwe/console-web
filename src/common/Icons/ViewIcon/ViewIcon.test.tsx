import { render } from '@testing-library/react'
import { ViewIcon } from '.'
import '@testing-library/jest-dom'

describe('ViewIcon', () => {
  it('should render ViewIcon component', () => {
    const { container } = render(<ViewIcon />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
