import { render, screen, fireEvent } from '@testing-library/react'
import { Select } from '.'
import '@testing-library/jest-dom'

describe('Select', () => {
  it('should render the Select', () => {
    const { container } = render(<Select options={[]} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render the Select with selected value', () => {
    render(
      <Select
        options={[
          {
            name: 'test1',
            value: 'test1'
          },
          {
            name: 'test2',
            value: 'test2'
          },
          {
            name: 'test3',
            value: 'test3'
          }
        ]}
        value={{
          name: 'test1',
          value: 'test1'
        }}
        label="Select"
      />
    )

    const label = screen.getByText('Select')
    expect(label).toBeInTheDocument()
    const selectedItens = screen.getByText('test1')
    expect(selectedItens).toBeInTheDocument()
  })

  it('should select another option and render the correct option', () => {
    render(
      <Select
        options={[
          {
            name: 'test1',
            value: 'test1'
          },
          {
            name: 'test2',
            value: 'test2'
          }
        ]}
      />
    )

    const openOptionsButton = screen.getByRole('button')
    fireEvent.click(openOptionsButton)

    const option = screen.getByText('test1')
    fireEvent.click(option)

    const selectedItem = screen.getByText('test1')
    expect(selectedItem).toBeInTheDocument()
  })

  it('should remove a selected option', () => {
    render(
      <Select
        options={[
          {
            name: 'test1',
            value: 'test1'
          },
          {
            name: 'test2',
            value: 'test2'
          }
        ]}
        value={{
          name: 'test1',
          value: 'test1'
        }}
      />
    )

    const openOptionsButton = screen.getByRole('button')
    fireEvent.click(openOptionsButton)

    const option = screen.getByTitle('test1')
    const secondOption = screen.getByTitle('test2')
    expect(option).toHaveClass('font-semibold')
    const checkIcon = screen.getByRole('checkicon')
    fireEvent.focus(checkIcon)
    expect(checkIcon).toHaveClass('text-white')
    fireEvent.click(secondOption)

    const selectedItem = screen.queryByText('test1')
    expect(selectedItem).not.toBeInTheDocument()
  })

  it('should show a error message', () => {
    render(<Select options={[]} errors={{ message: 'Please select option' }} />)

    const errorMessage = screen.getByText('Please select option')
    expect(errorMessage).toBeInTheDocument()
  })

  it('should handle the selected value', () => {
    let item: { name: string; value: string } = { name: '', value: ''}
    render(
      <Select
        options={[{ name: 'test1', value: 'test1' }]}
        onChange={(value) => (item = value)}
        errors={{ message: 'Please select option' }}
      />
    )

    const openOptionsButton = screen.getByRole('button')
    fireEvent.click(openOptionsButton)

    const option = screen.getByText('test1')
    fireEvent.click(option)

    expect(item.name).toBe('test1')
  })
})
