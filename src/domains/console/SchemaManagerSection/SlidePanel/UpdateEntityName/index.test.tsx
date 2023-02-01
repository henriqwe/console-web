import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { UpdateEntityName } from '.'
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
    setSelectedEntity: (val: string) => {
      selectedEntity = val
    },

    setOpenSlide: () => null,
    setBreadcrumbPages: () => null,
    breadcrumbPagesData: {
      home: [
        {
          content: 'string',
          current: false
        }
      ],
      createEntity: [
        {
          content: 'string',
          current: false
        }
      ],
      viewEntity: (entityName: string) => null,
      viewEntityRelationship: (entityName: string) => null
    }
  })
}))

describe('UpdateEntityName', () => {
  afterEach(() => {
    toastCalls = []
    selectedEntity = 'books'
  })

  it('should render UpdateEntityName component', () => {
    const { container } = render(<UpdateEntityName />)

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should handle submit action', async () => {
    let requestedUrl = ''
    jest.spyOn(utils.api, 'put').mockImplementation(async (url: string) => {
      requestedUrl = url
    })
    render(<UpdateEntityName />)

    const nameInput = screen.getByPlaceholderText('field name')
    fireEvent.change(nameInput, { target: { value: 'bookshelf' } })

    const submitButton = screen.getByText('Update')

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(requestedUrl).toBe(
        'v0/modeling/project-name/schema1/schema/sql/entity/books'
      )

      expect(toastCalls.includes('Operation performed successfully')).toBe(true)
    })
  })

  it('should break submit action', async () => {
    jest.spyOn(utils.api, 'put').mockImplementation(async (url: string) => {
      throw new Error('it broke')
    })
    render(<UpdateEntityName />)

    const nameInput = screen.getByPlaceholderText('field name')
    fireEvent.change(nameInput, { target: { value: 'bookshelf' } })

    const submitButton = screen.getByText('Update')

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(toastCalls.includes('it broke')).toBe(true)
    })
  })
})
