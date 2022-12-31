import { fireEvent, render, screen } from '@testing-library/react'
import { Docs } from './Docs'
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

describe('Docs', () => {
  it('should render Docs component', () => {
    const { container } = render(<Docs />)

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render AuthLayout component with dark state', () => {
    isDark = true
    const { container } = render(<Docs />)

    expect(screen.getByTestId('heroBackground')).toBeInTheDocument()
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should access the docs', () => {
    const spyWindowOpen = jest.spyOn(window, 'open')
    let pushedUrl = ''
    spyWindowOpen.mockImplementation((val: any) => {
      pushedUrl = val as string
    })
    const { container } = render(<Docs />)

    const accessDocsButton = screen.getByText('Access Docs')

    fireEvent.click(accessDocsButton)
    expect(accessDocsButton).toBeInTheDocument()
    expect(pushedUrl).toBe('https://docs.ycodify.com/')
    expect(container.firstChild).toBeInTheDocument()
  })
})
