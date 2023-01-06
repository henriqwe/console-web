import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Create } from './index'
import React from 'react'

jest.mock('domains/dashboard/MyAccount/Cards/CreditCardContext', () => ({
  useData: () => ({
    creditCardSchema: 'string',
    setCreditCardNumber: () => null,
    setOpenSlide: () => null,
    getCards: () => null
  })
}))

describe('Create component', () => {
  it('should render Create component', () => {
    render(<Create />)
    expect(screen.getByText(`Create`)).toBeInTheDocument()
  })
})
