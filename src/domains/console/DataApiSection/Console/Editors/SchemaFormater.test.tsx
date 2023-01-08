import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { SchemaFormater } from './SchemaFormater'
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

describe('SchemaFormater', () => {
  afterEach(() => {
    isDark = false
  })
  it('should render SchemaFormater component', () => {
    const { container } = render(<SchemaFormater />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should download the schema', () => {
    render(<SchemaFormater />)

    const downloadDiv = screen.getByTitle('Download schema')
    fireEvent.click(downloadDiv.firstChild as Element)

    waitFor(() => {
      const downloadLink = screen.getByTitle('download link')
      expect(downloadLink).toBeInTheDocument()
    })
  })

  it('should render SchemaFormater component with dark editor', () => {
    isDark = true
    const { container } = render(<SchemaFormater />)

    expect(container.firstChild?.firstChild).not.toHaveClass('cm-theme-light')
  })
})
