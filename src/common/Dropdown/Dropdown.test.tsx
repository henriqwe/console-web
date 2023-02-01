import { render, screen, fireEvent } from '@testing-library/react'
import { Dropdown } from '.'
import '@testing-library/jest-dom'

describe('Dropdown', () => {
  it('should render the Dropdown', () => {
    render(<Dropdown actions={[]}>Dropdown</Dropdown>)

    const dropdownChildren = screen.getByText('Dropdown')

    expect(dropdownChildren).toBeInTheDocument()
  })

  it('should render the Dropdown actions with roundend corners', () => {
    render(
      <Dropdown
        actions={[
          {
            title: 'firstAction',
            onClick: () => null
          },
          {
            title: 'secondAction',
            onClick: () => null
          },
          {
            title: 'lastAction',
            onClick: () => null
          }
        ]}
      >
        Dropdown
      </Dropdown>
    )

    const dropdownButton = screen.getByTitle('Open options')
    fireEvent.click(dropdownButton)

    const firstAction = screen.getByTitle('firstAction')
    expect(firstAction.classList.contains('rounded-t-md'))
    const lastAction = screen.getByTitle('lastAction')
    expect(firstAction.classList.contains('rounded-b-md'))
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
    const dropdownButton = screen.getByTitle('Open options')
    fireEvent.click(dropdownButton)

    const actionTitle = screen.getByText('action')
    expect(actionTitle).toBeInTheDocument()

    fireEvent.focus(actionTitle)

    expect(actionTitle).toHaveClass('text-gray-900')

    fireEvent.click(actionTitle)
    expect(number).toBe(6)
  })
})
