import { render, screen } from '@testing-library/react'
import { Label } from '.'
import '@testing-library/jest-dom'

describe('Label', () => {
  it('should render the Label', () => {
    const { container } = render(<Label />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render the Label with the correct text', () => {
    render(<Label text="test" />)
    const LabelText = screen.getByText('test')
    expect(LabelText).toBeInTheDocument()
  })

  it('should render the Label with all kind of sizes', () => {
    const { rerender, container } = render(<Label text="test" size="small" />)
    expect(container.firstChild).toHaveClass('px-2.5 py-0.5 text-xs')

    rerender(<Label text="test" size="medium" />)
    expect(container.firstChild).toHaveClass('px-3 py-[.18rem] text-sm')

    rerender(<Label text="test" size="large" />)
    expect(container.firstChild).toHaveClass('px-[15px] py-1 text-base')
  })
})
