import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { Slide } from './Slide'
import '@testing-library/jest-dom'

let slideState = { open: true, type: 'CodeExporterView' }
jest.mock('domains/console/SchemaManagerContext', () => ({
  useSchemaManager: () => ({
    slideState,
    setSlideState: (val: { open: boolean; type: string }) => {
      slideState = val
    }
  })
}))

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

const mock = function () {
  return {
    observe: jest.fn(),
    disconnect: jest.fn()
  }
}

//--> assign mock directly without jest.fn
window.IntersectionObserver = mock as any

describe('Slide', () => {
  afterEach(() => {
    isDark = false
  })
  it('should render Slide component', () => {
    const { container } = render(<Slide />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render Slide component with other content', () => {
    slideState.type = 'asd'
    render(<Slide />)

    const title = screen.getByText('Endpoint and resquest headers')
    expect(title).toBeInTheDocument()
  })

  it('should close the slide', () => {
    render(<Slide />)

    const closeButton = screen.getByText('Close panel')

    fireEvent.click(closeButton)

    waitFor(() => {
      expect(closeButton).not.toBeInTheDocument()
    })
  })
})
