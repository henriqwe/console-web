import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { FieldDetail } from './FieldDetail'
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

let selectedEntity = 'books'
jest.mock('domains/console/SchemaManagerContext', () => ({
  useSchemaManager: () => ({
    selectedEntity,
    setReload: () => null,
    reload: false,
    columnNames: ['name', 'author']
  })
}))

describe('FieldDetail', () => {
  afterEach(() => {
    toastCalls = []
    selectedEntity = 'books'
  })

  it('should render FieldDetail component', () => {
    const { container } = render(
      <FieldDetail
        data={{
          name: 'name',
          comment: 'string',
          createdAt: 0,
          isIndex: true,
          nullable: true,
          unique: true,
          length: 0,
          type: 'string'
        }}
        setShowDetails={jest.fn()}
      />
    )

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should close the component', () => {
    const setShowDetails = jest.fn()
    render(
      <FieldDetail
        data={{
          name: 'name',
          comment: 'string',
          createdAt: 0,
          isIndex: true,
          nullable: true,
          unique: true,
          length: 0,
          type: 'string'
        }}
        setShowDetails={setShowDetails}
      />
    )

    const closeButton = screen.getByText('Close')
    fireEvent.click(closeButton)
    expect(setShowDetails).toBeCalledWith(false)
  })

  it('should remove an attribute', async () => {
    let requestedUrl = ''
    jest.spyOn(utils.api, 'delete').mockImplementation(async (url: string) => {
      requestedUrl = url
    })
    render(
      <FieldDetail
        data={{
          name: 'name',
          comment: 'string',
          createdAt: 0,
          isIndex: true,
          nullable: true,
          unique: true,
          length: 0,
          type: 'string'
        }}
        setShowDetails={jest.fn()}
      />
    )

    const removeAttributeButton = screen.getByText('Remove attribute')

    fireEvent.click(removeAttributeButton)

    const modalButton = screen.getByTestId('modalButton')

    fireEvent.click(modalButton as Element)

    await waitFor(() => {
      expect(requestedUrl).toBe(
        'v0/modeling/project-name/schema1/schema/sql/entity/books/attribute/name'
      )

      expect(toastCalls.includes('Attribute name deleted successfully')).toBe(
        true
      )
    })
  })

  it('should breal remove attribute action', async () => {
    jest.spyOn(utils.api, 'delete').mockImplementation(async (url: string) => {
      throw new Error('it broke')
    })
    render(
      <FieldDetail
        data={{
          name: 'name',
          comment: 'string',
          createdAt: 0,
          isIndex: true,
          nullable: true,
          unique: true,
          length: 0,
          type: 'string'
        }}
        setShowDetails={jest.fn()}
      />
    )

    const removeAttributeButton = screen.getByText('Remove attribute')

    fireEvent.click(removeAttributeButton)

    const modalButton = screen.getByTestId('modalButton')

    fireEvent.click(modalButton as Element)

    await waitFor(() => {
      expect(toastCalls.includes('it broke')).toBe(true)
    })
  })

  it('should edit attribute name', async () => {
    let requestedUrl = ''
    let formData = {}
    jest
      .spyOn(utils.api, 'put')
      .mockImplementation(async (url: string, val: any) => {
        requestedUrl = url
        formData = val
      })
    render(
      <FieldDetail
        data={{
          name: 'name',
          comment: 'string',
          createdAt: 0,
          isIndex: true,
          nullable: true,
          unique: true,
          length: 0,
          type: 'string'
        }}
        setShowDetails={jest.fn()}
      />
    )

    const editNameButton = screen.getByTestId('edit-Name')
    fireEvent.click(editNameButton)

    const closeEditField = screen.getByTestId('cancel-Name')
    fireEvent.click(closeEditField)

    await waitFor(() => {
      expect(closeEditField).not.toBeInTheDocument()
    })
    fireEvent.click(screen.getByTestId('edit-Name'))

    const nameInput = screen.getByPlaceholderText('Attribute name')
    fireEvent.change(nameInput, { target: { value: 'newName' } })

    const submitButton = screen.getByTestId('submit-Name')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(requestedUrl).toBe(
        'v0/modeling/project-name/schema1/schema/sql/entity/books/attribute/name'
      )
      expect(formData).toStrictEqual({ name: 'newName' })
      expect(toastCalls.includes('Attribute updated successfully')).toBe(true)
    })
  })

  it('should break edit attribute action', async () => {
    jest
      .spyOn(utils.api, 'put')
      .mockImplementation(async (url: string, val: any) => {
        throw new Error('it broke')
      })
    render(
      <FieldDetail
        data={{
          name: 'name',
          comment: 'string',
          createdAt: 0,
          isIndex: true,
          nullable: true,
          unique: true,
          length: 0,
          type: 'string'
        }}
        setShowDetails={jest.fn()}
      />
    )

    const editNameButton = screen.getByTestId('edit-Name')
    fireEvent.click(editNameButton)

    const nameInput = screen.getByPlaceholderText('Attribute name')
    fireEvent.change(nameInput, { target: { value: 'author' } })

    const submitButton = screen.getByTestId('submit-Name')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(toastCalls.includes('Column name already exists')).toBe(true)
    })

    fireEvent.change(nameInput, { target: { value: 'author123' } })

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(toastCalls.includes('Column name can only contain letters')).toBe(
        true
      )
    })

    fireEvent.change(nameInput, { target: { value: 'author a' } })

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(toastCalls.includes('Column name cannot contain spaces')).toBe(
        true
      )
    })

    fireEvent.change(nameInput, { target: { value: 'newname' } })

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(toastCalls.includes('it broke')).toBe(true)
    })
  })

  it('should edit type name', async () => {
    let requestedUrl = ''
    let formData = {}
    jest
      .spyOn(utils.api, 'put')
      .mockImplementation(async (url: string, val: any) => {
        requestedUrl = url
        formData = val
      })
    render(
      <FieldDetail
        data={{
          name: 'name',
          comment: 'string',
          createdAt: 0,
          isIndex: true,
          nullable: true,
          unique: true,
          length: 0,
          type: 'string'
        }}
        setShowDetails={jest.fn()}
      />
    )

    const editNameButton = screen.getByTestId('edit-Type')
    fireEvent.click(editNameButton)

    const typeSelect = screen.getByText('string')
    fireEvent.click(typeSelect)
    const stringOption = screen.getByText('String')
    fireEvent.click(stringOption)

    const stringLengthInput = screen.getByPlaceholderText('String length')
    fireEvent.change(stringLengthInput, { target: { value: 512 } })

    const submitButton = screen.getByTestId('submit-Type')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(requestedUrl).toBe(
        'v0/modeling/project-name/schema1/schema/sql/entity/books/attribute/name'
      )
      expect(formData).toStrictEqual({ type: 'String', length: '512' })
      expect(toastCalls.includes('Attribute updated successfully')).toBe(true)
    })
  })

  it('should edit type name to a different type', async () => {
    let requestedUrl = ''
    let formData = {}
    jest
      .spyOn(utils.api, 'put')
      .mockImplementation(async (url: string, val: any) => {
        requestedUrl = url
        formData = val
      })
    render(
      <FieldDetail
        data={{
          name: 'name',
          comment: 'string',
          createdAt: 0,
          isIndex: true,
          nullable: true,
          unique: true,
          length: 0,
          type: 'string'
        }}
        setShowDetails={jest.fn()}
      />
    )

    const editNameButton = screen.getByTestId('edit-Type')
    fireEvent.click(editNameButton)

    const typeSelect = screen.getByText('string')
    fireEvent.click(typeSelect)
    const timestampOption = screen.getByText('Timestamp')
    fireEvent.click(timestampOption)

    const submitButton = screen.getByTestId('submit-Type')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(requestedUrl).toBe(
        'v0/modeling/project-name/schema1/schema/sql/entity/books/attribute/name'
      )
      expect(formData).toStrictEqual({ type: "Timestamp", length: undefined })
      expect(toastCalls.includes('Attribute updated successfully')).toBe(true)
    })
  })

  it('should make the attribute to nullable', async () => {
    let requestedUrl = ''
    let formData = {}
    jest
      .spyOn(utils.api, 'put')
      .mockImplementation(async (url: string, val: any) => {
        requestedUrl = url
        formData = val
      })
    render(
      <FieldDetail
        data={{
          name: 'name',
          comment: 'string',
          createdAt: 0,
          isIndex: false,
          nullable: false,
          unique: false,
          length: 0,
          type: 'string'
        }}
        setShowDetails={jest.fn()}
      />
    )

    const editNameButton = screen.getByTestId('edit-Nullable')
    fireEvent.click(editNameButton)

    const nullableSelect = screen.getAllByText('False')
    fireEvent.click(nullableSelect[0])
    const trueOption = screen.getByText('True')
    fireEvent.click(trueOption)

    const submitButton = screen.getByTestId('submit-Nullable')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(requestedUrl).toBe(
        'v0/modeling/project-name/schema1/schema/sql/entity/books/attribute/name'
      )
      expect(formData).toStrictEqual({ nullable: true })
      expect(toastCalls.includes('Attribute updated successfully')).toBe(true)
    })
  })

  it('should make the attribute to unique', async () => {
    let requestedUrl = ''
    let formData = {}
    jest
      .spyOn(utils.api, 'put')
      .mockImplementation(async (url: string, val: any) => {
        requestedUrl = url
        formData = val
      })
    render(
      <FieldDetail
        data={{
          name: 'name',
          comment: 'string',
          createdAt: 0,
          isIndex: false,
          nullable: false,
          unique: false,
          length: 0,
          type: 'string'
        }}
        setShowDetails={jest.fn()}
      />
    )

    const editNameButton = screen.getByTestId('edit-Unique')
    fireEvent.click(editNameButton)

    const nullableSelect = screen.getAllByText('False')
    fireEvent.click(nullableSelect[1])
    const trueOption = screen.getByText('True')
    fireEvent.click(trueOption)

    const submitButton = screen.getByTestId('submit-Unique')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(requestedUrl).toBe(
        'v0/modeling/project-name/schema1/schema/sql/entity/books/attribute/name'
      )
      expect(formData).toStrictEqual({ unique: true })
      expect(toastCalls.includes('Attribute updated successfully')).toBe(true)
    })
  })

  it('should make the attribute an index', async () => {
    let requestedUrl = ''
    let formData = {}
    jest
      .spyOn(utils.api, 'put')
      .mockImplementation(async (url: string, val: any) => {
        requestedUrl = url
        formData = val
      })
    render(
      <FieldDetail
        data={{
          name: 'name',
          comment: 'string',
          createdAt: 0,
          isIndex: false,
          nullable: false,
          unique: false,
          length: 0,
          type: 'string'
        }}
        setShowDetails={jest.fn()}
      />
    )

    const editNameButton = screen.getByTestId('edit-Index')
    fireEvent.click(editNameButton)

    const nullableSelect = screen.getAllByText('False')
    fireEvent.click(nullableSelect[2])
    const trueOption = screen.getByText('True')
    fireEvent.click(trueOption)

    const submitButton = screen.getByTestId('submit-Index')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(requestedUrl).toBe(
        'v0/modeling/project-name/schema1/schema/sql/entity/books/attribute/name'
      )
      expect(formData).toStrictEqual({ isIndex: true })
      expect(toastCalls.includes('Attribute updated successfully')).toBe(true)
    })
  })

  it('should edit attribute comment', async () => {
    let requestedUrl = ''
    let formData = {}
    jest
      .spyOn(utils.api, 'put')
      .mockImplementation(async (url: string, val: any) => {
        requestedUrl = url
        formData = val
      })
    render(
      <FieldDetail
        data={{
          name: 'name',
          comment: 'string',
          createdAt: 0,
          isIndex: false,
          nullable: false,
          unique: false,
          length: 0,
          type: 'string'
        }}
        setShowDetails={jest.fn()}
      />
    )

    const editNameButton = screen.getByTestId('edit-Comment')
    fireEvent.click(editNameButton)

    const commentInput = screen.getByPlaceholderText('Attribute comment')
    fireEvent.change(commentInput, { target: { value: 'comment' } })

    const submitButton = screen.getByTestId('submit-Comment')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(requestedUrl).toBe(
        'v0/modeling/project-name/schema1/schema/sql/entity/books/attribute/name'
      )
      expect(formData).toStrictEqual({ comment: 'comment' })
      expect(toastCalls.includes('Attribute updated successfully')).toBe(true)
    })
  })
})
