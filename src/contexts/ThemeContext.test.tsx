import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider, useTheme } from './ThemeContext'
import React, { useEffect } from 'react'

let currentStep = 0
let setCurrentStep = jest.fn()
jest.mock('@reactour/tour', () => ({
  useTour: () => ({
    currentStep,
    setCurrentStep: jest.fn((val) => setCurrentStep(val))
  })
}))

describe('Theme context', () => {
  it('should render a component using theme provider', async () => {
    jest
      .spyOn(Object.getPrototypeOf(window.localStorage), 'getItem')
      .mockImplementation(() => {
        return 'dark'
      })
    Object.setPrototypeOf(window.localStorage.getItem, jest.fn())
    const Component = () => {
      const { isDark } = useTheme()

      return <div>{isDark ? 'true' : 'false'}</div>
    }
    render(
      <ThemeProvider>
        <Component />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(`true`)).toBeInTheDocument()
    })
  })

  it('should render a component with dark theme using theme provider', async () => {
    jest
      .spyOn(Object.getPrototypeOf(window.localStorage), 'getItem')
      .mockImplementation(() => {
        throw new Error('it broke')
      })
    Object.setPrototypeOf(window.localStorage.getItem, jest.fn())
    const Component = () => {
      const { isDark } = useTheme()

      return <div>{isDark ? 'true' : 'false'}</div>
    }
    render(
      <ThemeProvider>
        <Component />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(`false`)).toBeInTheDocument()
    })
  })

  it('should test window.onstorage function', async () => {
    jest
      .spyOn(Object.getPrototypeOf(window.localStorage), 'getItem')
      .mockImplementation(() => {
        return 'dark'
      })
    Object.setPrototypeOf(window.localStorage.getItem, jest.fn())

    const Component = () => {
      const { isDark } = useTheme()

      useEffect(() => {
        window.onstorage !== null && window.onstorage()
      }, [window?.onstorage])

      return <div>{isDark ? 'true' : 'false'}</div>
    }
    render(
      <ThemeProvider>
        <Component />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(`true`)).toBeInTheDocument()
    })
  })
})
