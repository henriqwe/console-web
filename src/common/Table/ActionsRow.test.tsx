import { render, screen, fireEvent } from '@testing-library/react'
import { ActionsRow } from '.'
import '@testing-library/jest-dom'

describe('Table', () => {
  const mock = function () {
    return {
      observe: jest.fn(),
      disconnect: jest.fn()
    }
  }

  //--> assign mock directly without jest.fn
  window.IntersectionObserver = mock as any
  it('should render the Table no data', () => {
    const { container } = render(<ActionsRow actions={[]} />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
