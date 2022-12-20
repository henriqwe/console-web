import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { MultiSelect } from '.'
import '@testing-library/jest-dom'

describe('MultiSelect', () => {
  it('should render the MultiSelect', () => {
    const { container } = render(
      <MultiSelect edit={false} options={[]} value={[]} />
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render the MultiSelect with selected value', () => {
    render(
      <MultiSelect
        edit={true}
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
        value={[
          {
            name: 'test1',
            value: 'test1'
          },
          {
            name: 'test2',
            value: 'test2'
          }
        ]}
        label="multiSelect"
      />
    )

    const label = screen.getByText('multiSelect')
    expect(label).toBeInTheDocument()
    const selectedItens = screen.getByText('test1, test2')
    expect(selectedItens).toBeInTheDocument()
  })

  it('should select another option and render the correct option', () => {
    render(
      <MultiSelect
        edit={true}
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
        value={[]}
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
      <MultiSelect
        edit={true}
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
        value={[
          {
            name: 'test1',
            value: 'test1'
          }
        ]}
      />
    )

    const openOptionsButton = screen.getByRole('button')
    fireEvent.click(openOptionsButton)

    const option = screen.getByTitle('test1')
    expect(option).toHaveClass('font-semibold')
    const checkIcon = screen.getByRole('checkicon')
    fireEvent.focus(checkIcon)
    expect(checkIcon).toHaveClass('text-white')
    fireEvent.click(option)

    const selectedItem = screen.queryByText('test1')
    expect(selectedItem).not.toBeInTheDocument()
  })

  it('should show a error message', () => {
    render(
      <MultiSelect
        options={[]}
        value={[]}
        errors={{ message: 'Please select option' }}
      />
    )

    const errorMessage = screen.getByText('Please select option')
    expect(errorMessage).toBeInTheDocument()
  })

  it('should handle the selected value', async () => {
    const onChange = jest.fn()
    act(() => {
      render(
        <MultiSelect
          edit={true}
          options={[
            { name: 'test1', value: 'test1' },
            { name: 'test2', value: 'test2' }
          ]}
          value={[{ name: 'test1', value: 'test1' }]}
          onChange={onChange}
          errors={{ message: 'Please select option' }}
        />
      )
    })

    await sleep(3000)
    expect(onChange).toBeCalled()
  })
})

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
