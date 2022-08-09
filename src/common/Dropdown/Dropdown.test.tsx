import { render, screen, fireEvent } from '@testing-library/react'
import { Dropdown } from '.'
import '@testing-library/jest-dom'

describe('Dropdown', () => {
  it('should render the Dropdown', () => {
    render(<Dropdown actions={[]}>Dropdown</Dropdown>)

    const dropdownChildren = screen.getByText('Dropdown')

    expect(dropdownChildren).toBeInTheDocument()
  })

  it('should handle an action on the dropdown', () => {
    let number = 5
    const { container } = render(
      <Dropdown
        actions={[
          {
            title: 'action',
            onClick: () => {
              number++
            }
          }
        ]}
      >
        Dropdown
      </Dropdown>
    )
    const dropdownButton = screen.getByTitle('open options')
    fireEvent.click(dropdownButton)

    const actionTitle = screen.getByText('action')
    expect(actionTitle).toBeInTheDocument()

    fireEvent.focus(actionTitle)

    expect(actionTitle).toHaveClass('text-gray-900')

  
    fireEvent.click(actionTitle)
    expect(number).toBe(6)
  
  })
})
