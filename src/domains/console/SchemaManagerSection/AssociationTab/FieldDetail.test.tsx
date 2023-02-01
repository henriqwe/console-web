import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { FieldDetail } from './FieldDetail'
import * as utils from 'utils'
import '@testing-library/jest-dom'

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
    put: jest.fn(),
    delete: jest.fn()
  }
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

jest.mock('domains/console/SchemaManagerContext', () => ({
  useSchemaManager: () => ({
    selectedEntity: 'books',
    setReload: () => null,
    reload: false,
    setSelectedEntity: () => null,
    schemaTables: {
      name: {
        comment: '',
        createdat: 123,
        length: 1,
        nullable: false,
        type: 'string',
        unique: false
      }
    }
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

describe('FieldDetail', () => {
  afterEach(() => {
    toastCalls = []
  })

  it('should render FieldDetail component', () => {
    const { container } = render(
      <FieldDetail
        attribute="name"
        setShowDetails={jest.fn()}
        schemaTables={{
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
        }}
      />
    )

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should close FieldDetail component', () => {
    const setShowDetails = jest.fn()
    render(
      <FieldDetail
        attribute="name"
        setShowDetails={setShowDetails}
        schemaTables={{
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
        }}
      />
    )

    const closeButton = screen.getByText('Close')

    fireEvent.click(closeButton)
    expect(setShowDetails).toBeCalled()
  })

  it('should remove the selected field', async () => {
    let pushedUrl = ''
    jest.spyOn(utils.api, 'delete').mockImplementation(async (url, options) => {
      pushedUrl = url
    })

    render(
      <FieldDetail
        attribute="name"
        setShowDetails={jest.fn()}
        schemaTables={{
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
        }}
      />
    )

    const removeButton = screen.getByText('Remove')
    fireEvent.click(removeButton)
    const modalButtonTitle = screen.getByText('Remove association')
    fireEvent.click(modalButtonTitle)

    await waitFor(() => {
      expect(pushedUrl).toBe(
        `v0/modeling/project-name/schema1/schema/sql/entity/books/association/name/type/string`
      )
      expect(toastCalls.includes('Attribute updated successfully')).toBe(true)
    })
  })

  it('should break remove the selected field action', async () => {
    jest.spyOn(utils.api, 'delete').mockImplementation(async (url, options) => {
      throw new Error('it broke')
    })
    render(
      <FieldDetail
        attribute="name"
        setShowDetails={jest.fn()}
        schemaTables={{
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
        }}
      />
    )

    const removeButton = screen.getByText('Remove')
    fireEvent.click(removeButton)
    const modalButtonTitle = screen.getByText('Remove association')
    fireEvent.click(modalButtonTitle)

    await waitFor(() => {
      expect(toastCalls.includes('it broke')).toBe(true)
    })
  })

  it('should edit selected field', async () => {
    render(
      <FieldDetail
        attribute="name"
        setShowDetails={jest.fn()}
        schemaTables={{
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
        }}
      />
    )

    const nameInput = screen.getByPlaceholderText('Association name')
    fireEvent.change(nameInput, { target: { value: 'Chapter' } })

    const saveButton = screen.getByText('Save')
    fireEvent.click(saveButton)

    let pushedUrl = ''
    jest.spyOn(utils.api, 'put').mockImplementation(async (url) => {
      pushedUrl = url
    })

    await waitFor(() => {
      expect(pushedUrl).toBe(
        'v0/modeling/project-name/schema1/schema/sql/entity/books/association/name'
      )
      expect(toastCalls.includes('Attribute updated successfully')).toBe(true)
    })
  })

  it('should break edit selected field action', async () => {
    render(
      <FieldDetail
        attribute="name"
        setShowDetails={jest.fn()}
        schemaTables={{
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
        }}
      />
    )

    const nameInput = screen.getByPlaceholderText('Association name')
    fireEvent.change(nameInput, { target: { value: 'Chapter' } })

    const saveButton = screen.getByText('Save')
    fireEvent.click(saveButton)

    jest.spyOn(utils.api, 'put').mockImplementation(async () => {
      throw new Error('it broke')
    })

    await waitFor(() => {
      expect(toastCalls.includes('it broke')).toBe(true)
    })
  })
})
