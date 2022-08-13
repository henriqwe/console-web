import { render, screen, fireEvent } from '@testing-library/react'
import { Table, ActionsRow } from '.'
import '@testing-library/jest-dom'

describe('Table', () => {
  const mock = function () {
    return {
      observe: jest.fn(),
      disconnect: jest.fn()
    }
  }

  //--> assign mock directly without jest.fn
  window.IntersectionObserver = mock as any
  it('should render the Table no data', () => {
    const { container } = render(<Table />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render the Table with no data and action', () => {
    let number = 5
    const { container } = render(
      <Table
        actions={() => (
          <ActionsRow
            actions={[
              {
                title: 'edit',
                handler: () => {
                  number++
                },
                icon: 'icon'
              }
            ]}
          />
        )}
      />
    )
    const notFound = screen.getByText('Data not found!')
    expect(notFound).toHaveAttribute('colSpan', '1')
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render a rounded Table', () => {
    const { container } = render(<Table rounded />)
    const tableWrapper = screen.getByRole('tableWrapper')
    expect(tableWrapper).toHaveClass('rounded-lg')
  })

  it('should render the Table values', () => {
    const { container } = render(
      <Table
        tableColumns={[{ name: 'testName', displayName: 'test name' }]}
        values={[
          {
            testName: 'testNameValue'
          }
        ]}
      />
    )
    const tableValue = screen.getByText('testNameValue')
    expect(tableValue).toBeInTheDocument()
  })

  it('should render the Table values with other background', () => {
    const { container } = render(
      <Table
        tableColumns={[
          { name: 'testName', displayName: 'test name' },
          { name: 'testName2', displayName: 'test name2' }
        ]}
        values={[
          {
            testName: 'testNameValue',
            testName2: 'testName2'
          },
          {
            testName: 'testNameValue',
            testName2: 'testName2'
          }
        ]}
      />
    )
    const tableValue = screen.getByTestId('tr0')
    expect(tableValue).toHaveClass('undefined')
    const secondTableValue = screen.getByTestId('tr1')
    expect(secondTableValue).toHaveClass('bg-gray-50 dark:bg-menu-primary')
  })

  it('should activate the action inside the Table', () => {
    let number = 5
    render(
      <Table
        tableColumns={[
          { name: 'testName', displayName: 'test name' },
          {
            name: 'handleValue',
            displayName: 'handle value',
            handler: () => 'value'
          }
        ]}
        values={[
          {
            testName: 'testNameValue1',
            handleValue: 'value'
          }
        ]}
        actions={(item) => (
          <ActionsRow
            actions={[
              {
                title: 'edit',
                handler: () => {
                  number++
                },
                icon: 'icon'
              }
            ]}
          />
        )}
      />
    )
    const tableValue = screen.getByText('testNameValue1')
    expect(tableValue).toBeInTheDocument()
    const icon = screen.getByText('icon')
    fireEvent.click(icon)
    expect(number).toBe(6)
  })
})
