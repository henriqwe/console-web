import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Slide } from './'
import React from 'react'

const mock = function () {
  return {
    observe: jest.fn(),
    disconnect: jest.fn()
  }
}

//--> assign mock directly without jest.fn
window.IntersectionObserver = mock as any

jest.mock('utils/api', () => ({
  localApi: {
    post: jest.fn()
  }
}))

jest.mock('utils/validateCard', () => ({
  ...jest.requireActual('utils/validateCard'),
  getCardBrand: jest.fn(),
  validateCVV: jest.fn()
}))

let toastCalls: string[] = []
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn().mockImplementation((...args) => {
      toastCalls.push(args[0])
    }),
    error: jest.fn().mockImplementation((...args) => {
      toastCalls.push(args[0])
    })
  }
}))

let openSlide = true
jest.mock('domains/dashboard/MyAccount/Cards/CreditCardContext', () => ({
  useData: () => ({
    creditCardSchema: 'string',
    setCreditCardNumber: () => null,
    creditCardNumber: '123456789012345',
    getCards: () => null,
    openSlide,
    setOpenSlide: (val: boolean) => {
      openSlide = val
    }
  })
}))

let gatewayPaymentKey: undefined | string = '123'
jest.mock('contexts/UserContext', () => ({
  useUser: () => ({
    user: {
      gatewayPaymentKey
    }
  })
}))

describe('Slide component', () => {
  afterEach(() => {
    toastCalls = []
    gatewayPaymentKey = '123'
  })

  it('should render Slide component', () => {
    render(<Slide />)
    expect(screen.getByText(`Adding credit card`)).toBeInTheDocument()
  })

  it('should handle setOpen action', () => {
    render(<Slide />)

    const closeButton = screen.getByText('Close panel')
    fireEvent.click(closeButton)

    expect(openSlide).toBe(false)
  
  })
})

