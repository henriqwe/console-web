import { render, screen, fireEvent } from '@testing-library/react'
import { Separator } from '.'
import '@testing-library/jest-dom'

describe('Separator', () => {
  it('should render the Separator', () => {
    const { container } = render(<Separator />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
