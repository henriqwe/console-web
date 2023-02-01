import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { ViewConsole } from '.'
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

let currentTab = 'Schema'
jest.mock('domains/console/SchemaManagerContext', () => ({
  useSchemaManager: () => ({
    currentTab,
    entities: []
  })
}))

let selectedTab = { name: 'Schema' }
jest.mock('domains/console/Sidebar/SidebarContext', () => ({
  useSidebar: () => ({
    selectedTab
  })
}))

let setSchemaTabData = jest.fn()
let tabsData: any[] | undefined = []
jest.mock('domains/console/ConsoleEditorContext', () => ({
  useConsoleEditor: () => ({
    tabsData,
    documentationValue: '123',
    setSchemaTabData: jest.fn((val) => setSchemaTabData(val))
  })
}))

jest.mock('domains/console/SchemaManagerSection', () => ({
  SchemaManagerSection: () => {
    return <div>SchemaManagerSection</div>
  }
}))

jest.mock('domains/console/Sidebar', () => ({
  SideBar: () => {
    return <div>SideBar</div>
  }
}))

jest.mock('domains/console/DataApiSection', () => ({
  DataApiSection: () => <div>DataApiSection</div>
}))

jest.mock('domains/console/SchemaManagerSection/UsersSection', () => ({
  UsersSection: () => <div>UsersSection</div>
}))

jest.mock(
  'domains/console/DataApiSection/Console/Editors/SchemaFormater',
  () => ({
    SchemaFormater: () => <div>SchemaFormater</div>
  })
)

describe('ViewConsole', () => {
  afterEach(() => {
    toastCalls = []
    currentTab = 'Schema'
  })

  it('should render ViewConsole component with SchemaManagerSection', async () => {
    const { container } = render(<ViewConsole />)

    expect(container.firstChild).toBeInTheDocument()

    await waitFor(() => {
      expect(setSchemaTabData).toBeCalled()
    })
  })

  it('should render ViewConsole component with DataApiSection', async () => {
    currentTab = 'Data API'
    const { container } = render(<ViewConsole />)

    expect(container.firstChild).toBeInTheDocument()
    const dataApi = screen.getByText('DataApiSection')

    expect(dataApi).toBeInTheDocument()
  })

  it('should render ViewConsole component with UsersSection', async () => {
    tabsData = undefined
    currentTab = 'USERS'
    const { container } = render(<ViewConsole />)

    expect(container.firstChild).toBeInTheDocument()

    const usersSection = screen.getByText('UsersSection')

    expect(usersSection).toBeInTheDocument()
  })
})
