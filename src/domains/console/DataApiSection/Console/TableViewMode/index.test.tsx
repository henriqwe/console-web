import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { TableViewMode } from '.'
import '@testing-library/jest-dom'

let consoleResponse: any[] = []
jest.mock('domains/console/ConsoleEditorContext', () => ({
  useConsoleEditor: () => ({
    consoleResponse
  })
}))

let toastCalls: string[] = []
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn().mockImplementation((...args) => {
      toastCalls.push(args[0])
    }),
    error: jest.fn().mockImplementation((...args) => {
      toastCalls.push(args[0])
    })
  }
}))

describe('TableViewMode', () => {
  afterEach(() => {
    consoleResponse = []
  })
  it('should render TableViewMode component', () => {
    const { container } = render(<TableViewMode />)

    const noData = screen.getByText('No data to list')
    expect(container.firstChild).toBeInTheDocument()
    expect(noData).toBeInTheDocument()
  })

  it('should render TableViewMode component with data', () => {
    consoleResponse = [
      {
        tables: [
          {
            a: '12453',
            c: '458',
            id: 1,
            name: 'string',
            test: '1234',
            tz: '4588',
            foo: '542',
            _createdat: new Date(),
            _updatedat: new Date(0)
          }
        ]
      }
    ]
    render(<TableViewMode />)

    const noData = screen.queryByText('No data to list')
    expect(noData).not.toBeInTheDocument()

    const name = screen.getByText('string')
    expect(name).toBeInTheDocument()
  })

  it('should break the handleTableColumns function', () => {
    consoleResponse = [
      {
        tables: {}
      }
    ]
    render(<TableViewMode />)

    waitFor(() => {
      expect(
        toastCalls.includes(
          'TypeError: Cannot convert undefined or null to object'
        )
      ).toBe(true)
    })
  })
})
