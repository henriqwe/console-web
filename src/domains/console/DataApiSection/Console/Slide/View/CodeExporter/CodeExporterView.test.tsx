import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { CodeExporterView } from './CodeExporterView'
import '@testing-library/jest-dom'

let codeExporterValue = ''
jest.mock('domains/console/ConsoleEditorContext', () => ({
  useConsoleEditor: () => ({
    codeExporterValue,
    formaterCodeExporterValue: (val: string) => {
      codeExporterValue = '12345'
    }
  })
}))

let isDark = false
jest.mock('contexts/ThemeContext', () => ({
  useTheme: () => ({
    isDark
  })
}))

global.URL.createObjectURL = jest.fn()

describe('CodeExporterView', () => {
  afterEach(() => {
    isDark = false
  })
  it('should render CodeExporterView component', () => {
    const { container } = render(<CodeExporterView />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should copy the data to clipboard', () => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve())
      }
    })
    render(<CodeExporterView />)

    const clipboard = screen.getByTitle('Click to copy!')

    fireEvent.click(clipboard)

    expect(navigator.clipboard.writeText).toBeCalledWith('12345')
  })

  it('should render SchemaFormater component with dark editor', () => {
    isDark = true
    const { container } = render(<CodeExporterView />)

    expect(container.firstChild?.firstChild).not.toHaveClass('cm-theme-light')
  })
})
