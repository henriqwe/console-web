import { fireEvent, render, screen } from '@testing-library/react'
import { TutorialsAndDocs } from './TutorialsAndDocs'
import '@testing-library/jest-dom'

let isDark = false
jest.mock('contexts/ThemeContext', () => ({
  useTheme: () => ({
    isDark
  })
}))

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: ''
    }
  }
}))

describe('TutorialsAndDocs', () => {
  it('should render TutorialsAndDocs component', () => {
    const { container } = render(<TutorialsAndDocs />)

    expect(container.firstChild).toBeInTheDocument()
    const docs = screen.getAllByText('Docs')
    expect(docs.length).toBe(3)
  })

  it('should change the current tab', () => {
    const { container } = render(<TutorialsAndDocs />)

    expect(container.firstChild).toBeInTheDocument()
    const docs = screen.getAllByText('Docs')
    fireEvent.click(docs[docs.length - 1])
    expect(docs.length).toBe(3)
  })
})
