import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { SideBar } from '.'
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

let setCurrentTab = jest.fn()
jest.mock('domains/console/SchemaManagerContext', () => ({
  useSchemaManager: () => ({
    setCurrentTab: jest.fn((val) => setCurrentTab(val)),
    loadEntities: jest.fn(),
    entities: []
  })
}))

let selectedTab = { name: 'Schema' }
jest.mock('domains/console/Sidebar/SidebarContext', () => ({
  useSidebar: () => ({
    selectedTab
  })
}))

describe('SideBar', () => {
  afterEach(() => {
    toastCalls = []
    selectedTab = { name: 'Schema' }
  })

  it('should render SideBar component', async () => {
    const { container } = render(<SideBar />)

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should call setCurrentTab and render SchemaManagerTab', async () => {
    render(<SideBar />)

    await waitFor(() => {
      expect(setCurrentTab).toBeCalledWith('Schema')
    })

    const dataApi = screen.getByText('Data API')
    fireEvent.click(dataApi)

    expect(setCurrentTab).toBeCalledWith('Data API')
  })

  it('should call setCurrentTab and render DataApiTab', async () => {
    selectedTab = { name: 'Data API' }
    render(<SideBar />)

    waitFor(() => {
      expect(setCurrentTab).toBeCalledWith('Data API')
    })

    const schema = screen.getByText('Schema')
    fireEvent.click(schema)

    expect(setCurrentTab).toBeCalledWith('Schema')
  })
})
