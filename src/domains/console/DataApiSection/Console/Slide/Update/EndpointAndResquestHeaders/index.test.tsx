import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { EndpointAndResquestHeadersView } from '.'
import '@testing-library/jest-dom'

let consoleValue = ''
jest.mock('domains/console/ConsoleEditorContext', () => ({
  useConsoleEditor: () => ({
    documentationValue: ''
  })
}))

let slideState = { open: false, type: 'CodeExporterView' }
jest.mock('domains/console/SchemaManagerContext', () => ({
  useSchemaManager: () => ({
    slideState,
    setSlideState: (val: { open: boolean; type: string }) => {
      slideState = val
    }
  })
}))

let pushedRouter = ''
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: (val: string) => {
      pushedRouter = val
    },
    query: { name: 'schema1' }
  })
}))

let isDark = false
jest.mock('contexts/ThemeContext', () => ({
  useTheme: () => ({
    isDark
  })
}))

global.URL.createObjectURL = jest.fn()

describe('EndpointAndResquestHeadersView', () => {
  afterEach(() => {
    isDark = false
  })
  it('should render EndpointAndResquestHeadersView component', () => {
    const { container } = render(<EndpointAndResquestHeadersView />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
