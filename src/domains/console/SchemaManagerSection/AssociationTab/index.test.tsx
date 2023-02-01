import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { AssociationTab } from '.'
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

jest.mock('domains/console/SchemaManagerContext', () => ({
  useSchemaManager: () => ({
    selectedEntity: 'books',
    setReload: () => null,
    reload: false,
    setSelectedEntity: () => null,
    schemaTables: {
      books: {
        id: {
          comment: '',
          createdat: 123,
          length: 1,
          nullable: false,
          type: 'number',
          unique: false
        },
        name: {
          comment: '',
          createdat: 123,
          length: 1,
          nullable: false,
          type: 'string',
          unique: false
        },
        authors: {
          comment: '',
          createdat: 123,
          length: 1,
          nullable: false,
          type: 'authors',
          unique: false
        }
      },
      authors:{
        name: {
          comment: '',
          createdat: 123,
          length: 1,
          nullable: false,
          type: 'string',
          unique: false
        },
        books: {
          comment: '',
          createdat: 123,
          length: 1,
          nullable: false,
          type: 'books',
          unique: false
        }
      }
    }
  })
}))

describe('AssociationTab', () => {
  afterEach(() => {
    toastCalls = []
  })

  it('should render AssociationTab component', () => {
    const { container } = render(<AssociationTab />)

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should create a new association', async () => {
    let requestedUrl = ''
    jest.spyOn(utils.api, 'post').mockImplementation(async (url) => {
      requestedUrl = url
    })
    render(<AssociationTab />)

    const addAssociationButton = screen.getByText('Add Association')
    fireEvent.click(addAssociationButton)

    expect(addAssociationButton).not.toBeInTheDocument()

    const createAssociationButton = screen.getByText('Create')

    expect(createAssociationButton).toBeInTheDocument()

    const associationNameInput = screen.getByPlaceholderText('Association name')
    fireEvent.change(associationNameInput, { target: { value: 'author' } })

    const referenceEntitySelect = screen.getAllByText('Reference entity')

    fireEvent.click(referenceEntitySelect[1])
    const referenceOption = screen.getAllByText('books')
    fireEvent.click(referenceOption[1])

    const commentInput = screen.getByPlaceholderText('Comment')
    fireEvent.change(commentInput, { target: { value: 'comments' } })

    fireEvent.click(createAssociationButton)

    await waitFor(() => {
      expect(requestedUrl).toBe(
        'v0/modeling/project-name/schema1/schema/sql/entity/books/association'
      )
      expect(toastCalls.includes('Association author created successfully'))
    })
  })

  it('should break create a new association action', async () => {
    jest.spyOn(utils.api, 'post').mockImplementation(async (url) => {
      throw new Error('it broke')
    })
    render(<AssociationTab />)

    const addAssociationButton = screen.getByText('Add Association')
    fireEvent.click(addAssociationButton)

    expect(addAssociationButton).not.toBeInTheDocument()

    const createAssociationButton = screen.getByText('Create')

    expect(createAssociationButton).toBeInTheDocument()

    const associationNameInput = screen.getByPlaceholderText('Association name')
    fireEvent.change(associationNameInput, { target: { value: 'author' } })

    const referenceEntitySelect = screen.getAllByText('Reference entity')

    fireEvent.click(referenceEntitySelect[1])
    const referenceOption = screen.getAllByText('books')
    fireEvent.click(referenceOption[1])

    const commentInput = screen.getByPlaceholderText('Comment')
    fireEvent.change(commentInput, { target: { value: 'comments' } })

    fireEvent.click(createAssociationButton)

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    })

    await waitFor(() => {
      expect(toastCalls.includes('it broke'))
    })
  })

  it('should close create a new association form', async () => {
    jest.spyOn(utils.api, 'post').mockImplementation(async (url) => {
      throw new Error('it broke')
    })
    render(<AssociationTab />)

    const addAssociationButton = screen.getByText('Add Association')
    fireEvent.click(addAssociationButton)

    expect(addAssociationButton).not.toBeInTheDocument()

    const closeFormButton = screen.getByText('Close')

    fireEvent.click(closeFormButton)


    expect(closeFormButton).not.toBeInTheDocument()
  })
})
