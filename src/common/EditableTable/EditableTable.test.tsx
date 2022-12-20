import { fireEvent, render, renderHook, screen } from '@testing-library/react'
import { EditableTable } from '.'
import { FormProvider, useForm } from 'react-hook-form'
import '@testing-library/jest-dom'
import { ReactElement, ReactNode } from 'react'

describe('EditableTable', () => {
  it('should render the EditableTable', () => {
    const { result } = renderHook(() => useForm())
    const { container } = render(
      <EditableTable
        collection={[]}
        columns={[]}
        fieldName=""
        control={result.current.control}
      />
    )

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render the EditableTable with the correct columns', () => {
    const { result } = renderHook(() => useForm())
    render(
      <EditableTable
        collection={[]}
        columns={[
          {
            key: 'value',
            title: 'Value1',
            type: 'input',
            placeholder: 'type the value here'
          }
        ]}
        fieldName=""
        control={result.current.control}
      />
    )

    const columnTitle = screen.getByText('Value1')

    expect(columnTitle).toBeInTheDocument()
  })

  it('should render the EditableTable with the correct value', () => {
    const { result } = renderHook(() => useForm())
    render(
      <EditableTable
        collection={[
          {
            value: 'test'
          }
        ]}
        columns={[
          {
            key: 'value',
            title: 'Value1',
            type: 'normal',
            placeholder: 'type the value here'
          }
        ]}
        fieldName=""
        control={result.current.control}
      />
    )

    const value = screen.getByText('test')

    expect(value).toBeInTheDocument()
  })

  it('should render the EditableTable with all kind of types', () => {
    const { result } = renderHook(() => useForm())
    const { container } = render(
      <EditableTable
        inputPlaceholder="testInputPlaceholder"
        collection={[
          {
            value1: 'test',
            value2: 'test2',
            value3: 'test3',
            value4: 'test4',
            inputType: 'password'
          }
        ]}
        columns={[
          {
            key: 'value1',
            title: 'Value1',
            type: 'normal',
            placeholder: 'type the value here'
          },
          {
            key: 'value2',
            title: 'Value2',
            type: 'input',
            placeholder: 'type the value here'
          },
          {
            key: 'value3',
            title: 'Value3',
            type: 'password',
            placeholder: 'type the value here'
          },
          {
            key: 'value4',
            title: 'Value4',
            type: 'checkbox',
            placeholder: 'type the value here'
          }
        ]}
        fieldName=""
        control={result.current.control}
      />
    )

    const value = screen.getByText('test')
    const inputValue = screen.getByDisplayValue('test2')
    const passwordValue = screen.getByDisplayValue('test3')
    const checkBoxValue = screen.getByRole('checkbox')

    expect(value).toBeInTheDocument()
    expect(inputValue).toBeInTheDocument()
    expect(inputValue).toHaveAttribute('placeholder', 'testInputPlaceholder')
    expect(passwordValue).toBeInTheDocument()
    expect(passwordValue).toHaveAttribute('type', 'password')
    expect(checkBoxValue).toBeInTheDocument()
    expect(checkBoxValue).toHaveAttribute('type', 'checkbox')
  })

  it('should edit all kind of types', () => {
    const { result } = renderHook(() => useForm())
    const onChangeModifier = jest.fn()
    render(
      <EditableTable
        inputPlaceholder="testInputPlaceholder"
        onChangeModifier={onChangeModifier}
        collection={[
          {
            value2: 'test2',
            value3: 'test3',
            value4: 'test4'
          }
        ]}
        columns={[
          {
            key: 'value2',
            title: 'Value2',
            type: 'input',
            placeholder: 'type the value here'
          },
          {
            key: 'value3',
            title: 'Value3',
            type: 'password',
            placeholder: 'type the value here'
          },
          {
            key: 'value4',
            title: 'Value4',
            type: 'checkbox',
            placeholder: 'type the value here'
          }
        ]}
        fieldName=""
        control={result.current.control}
      />
    )

    const inputValue = screen.getByDisplayValue('test2')
    fireEvent.change(inputValue, { target: { value: 'new value' } })

    const passwordValue = screen.getByDisplayValue('test3')
    fireEvent.change(passwordValue, { target: { value: 'new value2' } })

    const checkBoxValue = screen.getByRole('checkbox')
    fireEvent.click(checkBoxValue, { target: { checked: true } })

    expect(inputValue).toBeInTheDocument()
    expect(inputValue).toHaveAttribute('placeholder', 'testInputPlaceholder')
    expect(passwordValue).toBeInTheDocument()
    expect(checkBoxValue).toBeInTheDocument()
    expect(onChangeModifier).toBeCalledTimes(3)
  })

  it('should disabled all kind of types', () => {
    const { result } = renderHook(() => useForm())
    const { container } = render(
      <EditableTable
        collection={[
          {
            value2: 'test2',
            value3: 'test3',
            value4: 'test4',
            icon: 'icon'
          }
        ]}
        columns={[
          {
            key: 'value2',
            title: 'Value2',
            type: 'input',
            placeholder: 'type the value here'
          },
          {
            key: 'value3',
            title: 'Value3',
            type: 'password',
            placeholder: 'type the value here'
          },
          {
            key: 'value4',
            title: 'Value4',
            type: 'checkbox',
            placeholder: 'type the value here'
          }
        ]}
        disabled
        fieldName=""
        control={result.current.control}
      />
    )

    const icon = screen.getAllByText('icon')
    const inputValue = screen.getByDisplayValue('test2')

    const passwordValue = screen.getByDisplayValue('test3')
    const checkBoxValue = screen.getByRole('checkbox')

    expect(icon.length).toBe(2)

    expect(inputValue).toBeDisabled()
    expect(inputValue.parentElement).toHaveClass(
      'bg-gray-100 dark:bg-menu-secondary'
    )
    expect(passwordValue).toBeDisabled()
    expect(passwordValue.parentElement).toHaveClass(
      'bg-gray-100 dark:bg-menu-secondary'
    )
    expect(checkBoxValue).toBeDisabled()
    expect(checkBoxValue.parentElement).toHaveClass(
      'bg-gray-100 dark:bg-menu-secondary'
    )
  })
})
