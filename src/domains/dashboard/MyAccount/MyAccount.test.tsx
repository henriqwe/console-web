import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { MyAccount } from './MyAccount'
import React from 'react'

describe('MyAccount component', () => {
  it('should render MyAccount component', () => {
    render(<MyAccount />)
    expect(screen.getByText(`My Account`)).toBeInTheDocument()
  })
})
