import { render, screen } from '@testing-library/react'
import { ClipboardIcon } from './'
import '@testing-library/jest-dom'

describe('ClipboardIcon', () => {
  it('should render the ClipboardIcon', () => {
    render(<ClipboardIcon data-testid="test1" />)
    const icon = screen.queryByTestId('test1')
    expect(icon).toBeInTheDocument()
  })
})
