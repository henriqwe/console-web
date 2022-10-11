import { render } from '@testing-library/react'
import { Colorschemes } from '.'
import '@testing-library/jest-dom'

describe('Colorschemes', () => {
  it('should render the Colorschemes illustration', () => {
    const { container } = render(<Colorschemes data-testid="test1" />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
