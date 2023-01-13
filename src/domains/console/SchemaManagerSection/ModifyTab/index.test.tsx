import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { ModifyTab } from '.'
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

const mock = function () {
  return {
    observe: jest.fn(),
    disconnect: jest.fn()
  }
}

//--> assign mock directly without jest.fn
window.IntersectionObserver = mock as any

jest.mock('utils/api', () => ({
  api: {
    put: jest.fn(),
    post: jest.fn(),
    delete: jest.fn()
  }
}))

let schemaStatus = 0
let selectedEntity = 'books'
jest.mock('domains/console/SchemaManagerContext', () => ({
  useSchemaManager: () => ({
    schemaStatus,
    setSchemaStatus: (val: number) => {
      schemaStatus = val
    },

    entityData: [
      {
        name: 'name',
        comment: 'string',
        createdAt: 0,
        isIndex: false,
        nullable: false,
        unique: false,
        length: 0,
        type: 'string'
      },
      {
        name: 'book',
        comment: 'string',
        createdAt: 0,
        isIndex: false,
        nullable: false,
        unique: false,
        length: 0,
        type: 'books'
      },
      {
        name: '_conf',
        comment: 'string',
        createdAt: 0,
        isIndex: false,
        nullable: false,
        unique: false,
        length: 0,
        type: 'string'
      },
      {
        name: '_deleted_at',
        comment: 'string',
        createdAt: 0,
        isIndex: false,
        nullable: false,
        unique: false,
        length: 0,
        type: 'number'
      }
    ],
    selectedEntity,
    setReload: () => null,
    reload: false,
    setSelectedEntity: (val: string) => {
      selectedEntity = val
    },
    columnNames: ['name'],
    schemaTables: {
      books: {
        name: {
          comment: '',
          createdat: 123,
          length: 1,
          nullable: false,
          type: 'string',
          unique: false
        }
      }
    },
    privateAttributes: ['_deleted_at'],
    setColumnNames: () => null
  })
}))

describe('ModifyTab', () => {
  afterEach(() => {
    toastCalls = []
    selectedEntity = 'books'
  })

  it('should render ModifyTab component', () => {
    const { container } = render(<ModifyTab loading={false} />)

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render ModifyTab component with loading status', () => {
    render(<ModifyTab loading={true} />)

    const loadingMessage = screen.getByText('Loading...')
    expect(loadingMessage).toBeInTheDocument()
  })

  it('should remove the current entity', async () => {
    let requestedUrl = ''
    jest.spyOn(utils.api, 'delete').mockImplementation(async (url: string) => {
      requestedUrl = url
    })
    render(<ModifyTab loading={false} />)

    const removeEntityButton = screen.getByText('Remove entity')

    fireEvent.click(removeEntityButton)

    const modalButton = screen.getByText('Close').parentElement?.firstChild

    fireEvent.click(modalButton as Element)

    await waitFor(() => {
      expect(requestedUrl).toBe(
        'v0/modeling/project-name/schema1/schema/sql/entity/books'
      )

      expect(toastCalls.includes('Entity books deleted successfully')).toBe(
        true
      )
    })
  })

  it('should break remove entity action', async () => {
    jest.spyOn(utils.api, 'delete').mockImplementation(async (url: string) => {
      throw new Error('it broke')
    })
    render(<ModifyTab loading={false} />)

    const removeEntityButton = screen.getByText('Remove entity')

    fireEvent.click(removeEntityButton)

    const modalButton = screen.getByText('Close').parentElement?.firstChild

    fireEvent.click(modalButton as Element)

    await waitFor(() => {
      expect(toastCalls.includes('it broke')).toBe(true)
    })
  })

  it('should add an attribute to the entity', async () => {
    let requestedUrl = ''
    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      requestedUrl = url
    })
    render(<ModifyTab loading={false} />)

    const addAttributeButton = screen.getByText('Add attribute')

    fireEvent.click(addAttributeButton)

    expect(addAttributeButton).not.toBeInTheDocument()

    const columnNameInput = screen.getByPlaceholderText('Column name')

    fireEvent.change(columnNameInput, { target: { value: 'year' } })

    const typeSelect = screen.getByText('Type')
    fireEvent.click(typeSelect)

    const stringOption = screen.getByText('String')
    fireEvent.click(stringOption)

    const stringLengthInput = screen.getByPlaceholderText('String Length')
    fireEvent.change(stringLengthInput, { target: { value: '' } })

    const submitButton = screen.getByTestId('submit')

    fireEvent.click(submitButton as Element)

    await waitFor(() => {
      expect(requestedUrl).toBe(
        'v0/modeling/project-name/schema1/schema/sql/entity/books/attribute'
      )
      expect(toastCalls.includes('Attribute year created successfully')).toBe(
        true
      )
    })
  })

  it('should open and close attribute form', async () => {
    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      throw new Error('it broke')
    })
    render(<ModifyTab loading={false} />)

    const addAttributeButton = screen.getByText('Add attribute')

    fireEvent.click(addAttributeButton)

    expect(addAttributeButton).not.toBeInTheDocument()

    const closeButton = screen.getByTestId('close')

    fireEvent.click(closeButton)

    expect(closeButton).not.toBeInTheDocument()
  })

  it('should break add attribute action', async () => {
    jest.spyOn(utils.api, 'post').mockImplementation(async (url: string) => {
      throw new Error('it broke')
    })
    render(<ModifyTab loading={false} />)

    const addAttributeButton = screen.getByText('Add attribute')

    fireEvent.click(addAttributeButton)

    expect(addAttributeButton).not.toBeInTheDocument()

    const columnNameInput = screen.getByPlaceholderText('Column name')

    fireEvent.change(columnNameInput, { target: { value: 'name' } })

    const typeSelect = screen.getByText('Type')
    fireEvent.click(typeSelect)

    const stringOption = screen.getByText('String')
    fireEvent.click(stringOption)

    const stringLengthInput = screen.getByPlaceholderText('String Length')
    fireEvent.change(stringLengthInput, { target: { value: 512 } })

    const submitButton = screen.getByTestId('submit')

    fireEvent.click(submitButton as Element)

    await waitFor(() => {
      const equalNameError = screen.getByText('Column name must be unique')
      expect(equalNameError).toBeInTheDocument()
    })

    fireEvent.change(columnNameInput, { target: { value: 'author' } })
    fireEvent.click(submitButton as Element)

    await waitFor(() => {
      expect(toastCalls.includes('it broke')).toBe(true)
    })
  })
})
