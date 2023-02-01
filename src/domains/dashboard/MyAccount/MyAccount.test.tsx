import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { MyAccount } from './MyAccount'
import React from 'react'

describe('MyAccount component', () => {
  it('should render MyAccount component', () => {
    render(<MyAccount />)
    expect(screen.getByText(`My Account`)).toBeInTheDocument()
  })

  it('should render MyAccount with another tab', () => {
    render(<MyAccount />)

    const option = screen.getByText('Billing')
    fireEvent.click(option)

    expect(screen.getByText(`Billing history`)).toBeInTheDocument()
  })
})
