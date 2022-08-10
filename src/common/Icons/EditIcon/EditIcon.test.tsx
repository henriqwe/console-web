import { render } from '@testing-library/react'
import { EditIcon } from '.'
import '@testing-library/jest-dom'

describe('EditIcon', () => {
  it('should render the EditIcon', () => {
    const { container } = render(<EditIcon data-testid="test1" />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
