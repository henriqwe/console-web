import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { DataApiTab } from '.'
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

jest.mock('domains/console/ConsoleEditorContext', () => ({
  useConsoleEditor: () => ({
    handleFormatQueryOrMutationEntityAndAttribute: jest.fn(),
    handleFormatQueryOrMutationEntity: jest.fn(),
    activeEntitiesSidebar: new Set(''),
    currentEditorAction: ''
  })
}))

describe('DataApiTab', () => {
  afterEach(() => {
    toastCalls = []
  })

  it('should render DataApiTab component', async () => {
    let requestedUrl: string
    jest.spyOn(utils.api, 'get').mockImplementation(async (url: string) => {
      requestedUrl = url
      return {
        data: {
          books: {
            _conf: null,
            name: 'books',
            data: []
          }
        }
      }
    })
    const { container } = render(<DataApiTab />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(() => {
      expect(requestedUrl).toBe('v0/modeling/project-name/schema1/schema/sql')
      const books = screen.getAllByText('books')
      expect(books[0]).toBeInTheDocument()
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  it('should break the load schema function', async () => {
    jest.spyOn(utils.api, 'get').mockImplementation(async (url: string) => {
      throw new Error('it broke')
    })
    render(<DataApiTab />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(() => {
      expect(toastCalls.includes('it broke')).toBe(true)
      expect(screen.getByText('Entities not found')).toBeInTheDocument()
    })
  })
})

// 'Modeler' | 'Databases' | 'Users and Roles'
// expect(window.localStorage.setItem).toHaveBeenCalledWith('clicked', 'yes')
