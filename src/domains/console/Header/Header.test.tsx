import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { Header } from './Header'
import '@testing-library/jest-dom'

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: (val: string) => {
      mockPush(val)
    },
    query: { name: 'schema1' }
  })
}))

describe('Header', () => {
  it('should render Header component', () => {
    const { container } = render(<Header />)

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should go back to dashboard', () => {
    render(<Header />)

    const goBack = screen.getByText('Back')

    fireEvent.click(goBack)
    expect(mockPush).toBeCalledWith('/')
  })
})
