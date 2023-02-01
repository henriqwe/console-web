import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { Operations } from './Operations'
import * as utils from 'utils'
import '@testing-library/jest-dom'

class ResizeObserver {
  callback: globalThis.ResizeObserverCallback

  constructor(callback: globalThis.ResizeObserverCallback) {
    this.callback = callback
  }

  observe(target: Element) {
    this.callback([{ target } as globalThis.ResizeObserverEntry], this)
  }

  unobserve() {}

  disconnect() {}
}

global.ResizeObserver = ResizeObserver

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
    get: jest.fn(),
    delete: jest.fn()
  },
  localApi: {
    post: jest.fn()
  }
}))

const handleFormatQueryOrMutationEntity = jest.fn()
let handleFormatQueryOrMutationEntityAndAttribute = jest.fn()
const activeEntitiesSidebar = new Set('')
let currentEditorAction = ''
jest.mock('domains/console/ConsoleEditorContext', () => ({
  useConsoleEditor: () => ({
    handleFormatQueryOrMutationEntityAndAttribute: jest.fn((val) =>
      handleFormatQueryOrMutationEntityAndAttribute(val)
    ),
    handleFormatQueryOrMutationEntity: jest.fn((val) =>
      handleFormatQueryOrMutationEntity(val)
    ),
    activeEntitiesSidebar,
    currentEditorAction
  })
}))

let privateAttributes = ['name']
jest.mock('domains/console/SchemaManagerContext', () => ({
  useSchemaManager: () => ({
    privateAttributes
  })
}))

describe('Operations', () => {
  afterEach(() => {
    toastCalls = []
    privateAttributes = ['name']
    handleFormatQueryOrMutationEntityAndAttribute = jest.fn()
  })

  it('should render Operations component', async () => {
    const { container } = render(
      <Operations
        entity={{
          name: 'string',
          data: {
            books: {
              createdat: 0,
              nullable: false,
              type: 'String',
              unique: false,
              length: 0,
              comment: 'string'
            }
          }
        }}
      />
    )

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should handle handleFormatQueryOrMutationEntity action', async () => {
    const { container } = render(
      <Operations
        entity={{
          name: 'string',
          data: {
            books: {
              createdat: 0,
              nullable: false,
              type: 'String',
              unique: false,
              length: 0,
              comment: 'string'
            }
          }
        }}
      />
    )

    const radioCheck = screen.getByTestId('radioCheck')
    fireEvent.click(radioCheck)

    expect(handleFormatQueryOrMutationEntity).toBeCalledWith({
      entity: 'string'
    })

    expect(activeEntitiesSidebar.has('string')).toBe(true)

    fireEvent.click(radioCheck)

    expect(activeEntitiesSidebar.has('string')).toBe(false)
  })

  it('should handle handleFormatQueryOrMutationEntityAndAttribute action', async () => {
    const { container } = render(
      <Operations
        entity={{
          name: 'string',
          data: {
            id: {
              comment: 'metadata controlled by YCodify platform',
              nullable: false,
              unique: true,
              createdat: 0,
              type: 'Integer'
            },
            books: {
              createdat: 0,
              nullable: false,
              type: 'String',
              unique: false,
              length: 0,
              comment: 'string'
            }
          }
        }}
      />
    )

    const entityName = screen.getByText('string')
    fireEvent.click(entityName)

    const handleDiv = screen.getAllByTestId('handle')
    fireEvent.click(handleDiv[1])

    expect(handleFormatQueryOrMutationEntityAndAttribute).toBeCalledWith({
      entity: 'string',
      attribute: 'books',
      attributeType: 'String'
    })

    expect(activeEntitiesSidebar.has('string')).toBe(true)
    expect(activeEntitiesSidebar.has('string-books')).toBe(true)

    fireEvent.click(handleDiv[1])

    expect(activeEntitiesSidebar.has('string-books')).toBe(false)
  })

  it('should render Operations component with other option', async () => {
    currentEditorAction = 'WRITE'
    privateAttributes = ['books']
    const { container } = render(
      <Operations
        entity={{
          name: 'string',
          data: {
            id: {
              comment: 'metadata controlled by YCodify platform',
              nullable: false,
              unique: true,
              createdat: 0,
              type: 'Integer'
            },
            books: {
              createdat: 0,
              nullable: false,
              type: 'String',
              unique: false,
              length: 0,
              comment: 'string'
            }
          }
        }}
      />
    )

    const entityName = screen.getByText('string')
    fireEvent.click(entityName)

    const handleDiv = screen.getAllByTestId('handle')
    fireEvent.click(handleDiv[1])

    expect(handleFormatQueryOrMutationEntityAndAttribute).not.toBeCalled()
    expect(handleDiv[1]).toHaveClass('cursor-not-allowed')

  })
})
