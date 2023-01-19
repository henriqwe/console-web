import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { SchemaManagerTab } from '.'
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

const loadEntities = jest.fn()
const goToUserAndRolesPage = jest.fn()
const goToModelerPage = jest.fn()
const goToEntitiesPage = jest.fn()
let setSelectedEntity = jest.fn()
let setShowCreateEntitySection = jest.fn()
let setBreadcrumbPages = jest.fn()
let setCurrentTabSchema = jest.fn()

let currentTabSchema = 'Modeler'
let entitiesLoading = false
let entities = ['books', 'itens']
jest.mock('domains/console/SchemaManagerContext', () => ({
  useSchemaManager: () => ({
    selectedEntity: 'books',
    setSelectedEntity: jest.fn((val) => setSelectedEntity(val)),
    reload: false,
    setShowCreateEntitySection: jest.fn((val) =>
      setShowCreateEntitySection(val)
    ),
    setBreadcrumbPages: jest.fn((val) => setBreadcrumbPages(val)),
    breadcrumbPagesData: {
      home: [],
      createEntity: [],
      viewEntity: (entityName: string) => [],
      viewEntityRelationship: (entityName: string) => []
    },
    goToEntitiesPage: jest.fn(() => goToEntitiesPage()),
    goToModelerPage: jest.fn(() => goToModelerPage()),
    setCurrentTabSchema: jest.fn((val) => setCurrentTabSchema(val)),
    currentTabSchema,
    goToUserAndRolesPage: jest.fn(() => goToUserAndRolesPage()),
    entities,
    loadEntities: jest.fn(() => loadEntities()),
    entitiesLoading
  })
}))
// 'Modeler' | 'Databases' | 'Users and Roles'

describe('SchemaManagerTab', () => {
  afterEach(() => {
    toastCalls = []
    currentTabSchema = 'Modeler'
    entitiesLoading = false
    entities = ['books', 'itens']
  })

  it('should render SchemaManagerTab component', async () => {
    const { container } = render(<SchemaManagerTab />)

    expect(container.firstChild).toBeInTheDocument()
    waitFor(() => {
      expect(loadEntities).toBeCalled()
    })
  })

  it('should go to modeler page', async () => {
    const { container } = render(<SchemaManagerTab />)

    expect(container.firstChild).toBeInTheDocument()
    const Modeler = screen.getByText('Modeler')
    expect(Modeler).toHaveClass('font-semibold')
    fireEvent.click(Modeler)
    expect(goToModelerPage).toBeCalled()
    const showDatabase = screen.getByTestId('showDatabase')
    fireEvent.click(showDatabase)

    const books = screen.getByText('books')
    expect(books).toBeInTheDocument()
  })

  it('should go to user and roles page', async () => {
    currentTabSchema = 'Users and Roles'
    const { container } = render(<SchemaManagerTab />)

    expect(container.firstChild).toBeInTheDocument()
    const UserAndRoles = screen.getByText('Users and roles')
    expect(UserAndRoles).toHaveClass('font-semibold')
    fireEvent.click(UserAndRoles)
    expect(goToUserAndRolesPage).toBeCalled()
  })

  it('should render without entities', async () => {
    currentTabSchema = 'Databases'
    entities = []
    render(<SchemaManagerTab />)

    const NotFound = screen.getByText('Database not found')
    expect(NotFound).toBeInTheDocument()
  })

  it('should render with loading entities status', async () => {
    currentTabSchema = 'Databases'
    entitiesLoading = true
    render(<SchemaManagerTab />)

    const loading = screen.getByText('Loading...')
    expect(loading).toBeInTheDocument()
  })

  it('should render with loading entities status', async () => {
    currentTabSchema = 'Databases'
    render(<SchemaManagerTab />)

    const books = screen.getByText('books')
    fireEvent.click(books)

    expect(setSelectedEntity).toBeCalledWith('books')
    expect(setShowCreateEntitySection).toBeCalledWith(false)
    expect(setBreadcrumbPages).toBeCalledWith([])
    expect(setCurrentTabSchema).toBeCalledWith('Databases')
  })
})

// 'Modeler' | 'Databases' | 'Users and Roles'
// expect(window.localStorage.setItem).toHaveBeenCalledWith('clicked', 'yes')
