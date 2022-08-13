import { render } from '@testing-library/react'
import { JavaScriptIcon } from '.'
import '@testing-library/jest-dom'

describe('JavaScriptIcon', () => {
  it('should render the JavaScriptIcon', () => {
    const { container } = render(<JavaScriptIcon data-testid="test1" />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
