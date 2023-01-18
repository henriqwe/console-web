import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { CreateEntity } from '.'
import * as utils from 'utils'
import '@testing-library/jest-dom'

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

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: (val: string) => {
      mockPush(val)
    },
    query: { name: 'schema1' }
  })
}))

jest.mock('utils/api', () => ({
  api: {
    post: jest.fn()
  }
}))

let columnNames: string[] = []
jest.mock('domains/console/SchemaManagerContext', () => ({
  useSchemaManager: () => ({
    selectedEntity: 'books',
    setReload: () => null,
    reload: false,
    setShowCreateEntitySection: () => null,
    setColumnNames: (val: any) => {
      if (typeof val === 'function') {
        columnNames = val(columnNames)
        return
      }
      columnNames = val
    },
    columnNames,
    breadcrumbPages: [
      {
        content: '',
        current: true,
        action: () => null
      }
    ]
  })
}))

describe('CreateEntity', () => {
  afterEach(() => {
    toastCalls = []
    columnNames = []
  })

  it('should render CreateEntity component', () => {
    const { container } = render(<CreateEntity />)

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should create an entity with two attributes', async () => {
    let requestedUrl = ''
    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      requestedUrl = url
    })

    render(<CreateEntity />)

    const entityNameInput = screen.getByPlaceholderText('Entity name')

    fireEvent.change(entityNameInput, { target: { value: 'books' } })

    const addColumnButton = screen.getByText('Add column')
    fireEvent.click(addColumnButton)

    const columnNameInput = screen.getAllByPlaceholderText('Column name')

    fireEvent.change(columnNameInput[0], { target: { value: 'name' } })
    fireEvent.change(columnNameInput[1], { target: { value: 'year' } })

    const columnTypeSelect = screen.getAllByText('String')

    fireEvent.click(columnTypeSelect[1])

    const timestampOption = screen.getByText('Timestamp')
    fireEvent.click(timestampOption)

    const lengthInput = screen.getByPlaceholderText('String Length')
    fireEvent.change(lengthInput, { target: { value: 512 } })

    const createEntityButton = screen.getByText('Create entity')
    fireEvent.click(createEntityButton)

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    })

    await waitFor(() => {
      expect(requestedUrl).toBe(
        'v0/modeling/project-name/schema1/schema/sql/entity'
      )
      expect(toastCalls.includes('Entity books created successfully'))
    })
  })

  it('should break create entity action', async () => {
    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      throw new Error('it broke')
    })

    render(<CreateEntity />)

    const entityNameInput = screen.getByPlaceholderText('Entity name')

    fireEvent.change(entityNameInput, { target: { value: 'books' } })

    const addColumnButton = screen.getByText('Add column')
    fireEvent.click(addColumnButton)

    const columnNameInput = screen.getAllByPlaceholderText('Column name')

    fireEvent.change(columnNameInput[0], { target: { value: 'name' } })
    fireEvent.change(columnNameInput[1], { target: { value: 'year' } })

    const columnTypeSelect = screen.getAllByText('String')

    fireEvent.click(columnTypeSelect[1])

    const timestampOption = screen.getByText('Timestamp')
    fireEvent.click(timestampOption)

    const lengthInput = screen.getByPlaceholderText('String Length')
    fireEvent.change(lengthInput, { target: { value: '512' } })

    const createEntityButton = screen.getByText('Create entity')
    fireEvent.click(createEntityButton)

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    })

    await waitFor(() => {
      expect(toastCalls.includes('it broke'))
    })
  })

  it('should add and remove a column', async () => {
    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      throw new Error('it broke')
    })

    render(<CreateEntity />)

    const entityNameInput = screen.getByPlaceholderText('Entity name')

    fireEvent.change(entityNameInput, { target: { value: 'books' } })

    const addColumnButton = screen.getByText('Add column')
    fireEvent.click(addColumnButton)

    const columnNameInput = screen.getAllByPlaceholderText('Column name')

    expect(columnNameInput.length).toBe(2)

    const Xbutton = screen.getAllByTestId('remove column')

    fireEvent.click(Xbutton[0].firstChild as ChildNode)

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    })

    waitFor(() => {
      const columnTypeSelect = screen.getAllByText('String')

      expect(columnTypeSelect.length).toBe(1)
    })
  })

  it('should block create an entity action because of duplicated columns', async () => {
    render(<CreateEntity />)

    const addColumnButton = screen.getByText('Add column')
    fireEvent.click(addColumnButton)

    const columnNameInput = screen.getAllByPlaceholderText('Column name')
    const createEntityButton = screen.getByText('Create entity')

    fireEvent.change(columnNameInput[0], { target: { value: 'author' } })
    fireEvent.change(columnNameInput[1], { target: { value: 'author' } })

    const columnTypeSelect = screen.getAllByText('String')

    fireEvent.click(columnTypeSelect[1])

    const timestampOption = screen.getByText('Timestamp')
    fireEvent.click(timestampOption)

    const comment = screen.getAllByTestId('comment')
    expect(comment[1]).toHaveClass('col-span-4')


    const lengthInput = screen.getByPlaceholderText('String Length')
    fireEvent.change(lengthInput, { target: { value: 'abc' } })
    fireEvent.click(createEntityButton)

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    })

    await waitFor(() => {
      const error = screen.getByText('Entity name is required')
      expect(error).toBeInTheDocument()
      const duplicatedErrorMessage = screen.getAllByText(
        'Column name must be unique'
      )
      expect(duplicatedErrorMessage.length).toBeGreaterThan(0)
    })
  })
})
