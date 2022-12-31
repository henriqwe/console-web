import { fireEvent, render, screen } from '@testing-library/react'
import { Tutorials } from './Tutorials'
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

describe('Tutorials', () => {
  it('should render Tutorials component', () => {
    const { container } = render(<Tutorials />)

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should focus in a tutorial', () => {
    const { container } = render(<Tutorials />)

    const subtopicTitle = screen.getByText('title 1t3s')

    fireEvent.click(subtopicTitle)

    expect(subtopicTitle).toHaveClass('font-semibold text-sky-500 before:bg-sky-500')
    expect(container.firstChild).toBeInTheDocument()
  })

})
