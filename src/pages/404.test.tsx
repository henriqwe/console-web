import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import ErrorPage from './404'
import React from 'react'

describe('ErrorPage', () => {
  it('should render ErrorPage', async () => {
    render(<ErrorPage />)

    expect(screen.getByText(`404 error`)).toBeInTheDocument()
  })
})
