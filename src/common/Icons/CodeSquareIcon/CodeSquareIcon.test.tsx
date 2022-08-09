import { render, screen } from '@testing-library/react'
import { CodeSquareIcon } from '.'
import '@testing-library/jest-dom'

describe('CodeSquareIcon', () => {
  it('should render the CodeSquareIcon', () => {
    render(<CodeSquareIcon data-testid="test1" />)
    const icon = screen.queryByTestId('test1')
    expect(icon).toBeInTheDocument()
  })
})
