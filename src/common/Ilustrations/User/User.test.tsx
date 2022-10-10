import { render } from '@testing-library/react'
import { User } from '.'
import '@testing-library/jest-dom'

describe('User', () => {
  it('should render the User illustration', () => {
    const { container } = render(<User data-testid="test1" />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
