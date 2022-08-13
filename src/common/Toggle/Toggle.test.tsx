import { fireEvent, render, screen } from '@testing-library/react'
import { Toggle } from '.'
import '@testing-library/jest-dom'
import React from 'react'
jest.mock('next/router', () => ({ push: jest.fn() }))

describe('Toggle', () => {
  const mock = function () {
    return {
      observe: jest.fn(),
      disconnect: jest.fn()
    }
  }

  //--> assign mock directly without jest.fn
  window.IntersectionObserver = mock as any
  it('should render the Toggle', () => {
    const { container } = render(<Toggle enabled onChange={() => null} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render the enabled Toggle', () => {
    const { container } = render(<Toggle enabled onChange={() => null} />)
    expect(container.firstChild).toHaveClass('bg-indigo-600')
    const toggle = screen.getByRole('switch')
    expect(toggle.lastChild).toHaveClass('translate-x-5')
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render the disabled Toggle', () => {
    const { container } = render(
      <Toggle enabled={false} onChange={() => null} />
    )
    expect(container.firstChild).toHaveClass('bg-gray-200')
    const toggle = screen.getByRole('switch')
    expect(toggle.lastChild).toHaveClass('translate-x-0')
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should handle the action when click the toggle button', () => {
    let number = 5
    const { container } = render(
      <Toggle enabled={false} onChange={() => number++} />
    )
    const toggle = screen.getByRole('switch')
    fireEvent.click(toggle)
    expect(number).toBe(6)
  })
})
