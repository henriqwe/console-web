import { render, screen, fireEvent } from '@testing-library/react'
import { ListRadioGroup } from '.'
import '@testing-library/jest-dom'

describe('ListRadioGroup', () => {
  it('should render the ListRadioGroup', () => {
    const { container } = render(
      <ListRadioGroup options={[]} setSelectedOption={jest.fn} />
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render a compact ListRadioGroup', () => {
    render(
      <ListRadioGroup
        options={[
          {
            content: <div />,
            value: 'test'
          }
        ]}
        setSelectedOption={jest.fn}
        compact
      />
    )
    const radioGroupOptionWrapper = screen.getByRole('list-group')
    expect(radioGroupOptionWrapper.firstChild).toHaveClass('px-2 py-2')

    expect(radioGroupOptionWrapper.firstChild).not.toHaveClass('flex-1 mt-0')
  })

  it('should render the ListRadioGroup with horizontal tabs', () => {
    render(
      <ListRadioGroup
        options={[
          {
            content: <div />,
            value: 'test'
          }
        ]}
        setSelectedOption={jest.fn}
        horizontal
      />
    )
    const radioGroupOptionWrapper = screen.getByRole('list-group')
    expect(radioGroupOptionWrapper).toHaveClass('flex-wrap')
    expect(radioGroupOptionWrapper.firstChild).toHaveClass('flex-1 mt-0')
  })

  it('should select a radio group option', () => {
    const { container } = render(
      <ListRadioGroup
        options={[
          {
            content: <div data-testid="test 1" />,
            value: 'test 1'
          },
          {
            content: <div data-testid="test 2" />,
            value: 'test 2'
          }
        ]}
        setSelectedOption={jest.fn}
        selectedValue={{
          content: <div data-testid="test 1" />,
          value: 'test 1'
        }}
        horizontal
      />
    )
    const radioGroupOptionWrapper = screen.getByRole('list-group')
    expect(radioGroupOptionWrapper.firstElementChild).toHaveClass(
      '!bg-blue-200'
    )
    const radioGroupOption = screen.getByTestId('test 2')
    fireEvent.click(radioGroupOption)

    expect(radioGroupOptionWrapper.firstElementChild).not.toHaveClass(
      '!bg-blue-200'
    )
  })

  it('should disable a radio group option', () => {
    const { container } = render(
      <ListRadioGroup
        options={[
          {
            content: <div data-testid="test 1" />,
            value: 'test 1'
          },
          {
            content: <div data-testid="test 2" />,
            value: 'test 2'
          }
        ]}
        selectedValue={{
          content: <div data-testid="test 1" />,
          value: 'test 1'
        }}
        disabled
        setSelectedOption={jest.fn}
        horizontal
      />
    )
    const radioGroupOptionWrapper = screen.getByRole('list-group')
    expect(radioGroupOptionWrapper.lastElementChild).toHaveClass(
      '!bg-gray-400 dark:bg-menu-secondary cursor-not-allowed'
    )

    expect(radioGroupOptionWrapper.firstElementChild).toHaveClass(
      'bg-gray-400 cursor-not-allowed'
    )
  })
})
