import { render } from '@testing-library/react'
import { PlayIcon } from '.'
import '@testing-library/jest-dom'

describe('PlayIcon', () => {
  it('should render the PlayIcon', () => {
    const { container } = render(<PlayIcon data-testid="test1" />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
