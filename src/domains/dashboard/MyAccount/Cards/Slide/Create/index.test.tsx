import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Create } from './index'
import React from 'react'

describe('Create component', () => {
  it('should render Create component', () => {
    render(<Create />)
    expect(screen.getByText(`Create`)).toBeInTheDocument()
  })
})
