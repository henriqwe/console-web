import { fireEvent, render, screen } from '@testing-library/react'
import { ToggleTheme } from '.'
import '@testing-library/jest-dom'
import React from 'react'
jest.mock('next/router', () => ({ push: jest.fn() }))

describe('ToggleTheme', () => {
  const mock = function () {
    return {
      observe: jest.fn(),
      disconnect: jest.fn()
    }
  }

  //--> assign mock directly without jest.fn
  window.IntersectionObserver = mock as any

  it('should render the ToggleTheme', () => {
    const { container } = render(<ToggleTheme />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render the ToggleTheme with changed colors', () => {
    const { container } = render(<ToggleTheme changeColor={false} />)
    expect(container.firstChild).toHaveClass(
      'text-white hover:bg-menuItem-secondary/40'
    )
  })

  it('should change the theme when click the button', () => {
    const { container } = render(<ToggleTheme />)
    const moonIcon = screen.getByTestId('moonIcon')
    expect(moonIcon).toBeInTheDocument()
    fireEvent.click(container.firstChild as ChildNode)
    const sunIcon = screen.getByTestId('sunIcon')
    expect(sunIcon).toBeInTheDocument()
    fireEvent.click(container.firstChild as ChildNode)
    const icon = screen.getByTestId('moonIcon')
    expect(icon).toBeInTheDocument()
  })
})
