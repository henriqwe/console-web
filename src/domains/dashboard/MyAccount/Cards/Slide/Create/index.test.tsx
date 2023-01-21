import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Create } from './index'
import React from 'react'
import * as utils from 'utils'

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

jest.mock('domains/dashboard/MyAccount/Cards/CreditCardContext', () => ({
  useData: () => ({
    creditCardSchema: 'string',
    setCreditCardNumber: () => null,
    creditCardNumber: '123456789012345',
    setOpenSlide: () => null,
    getCards: () => null
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

describe('Create component', () => {
  afterEach(() => {
    toastCalls = []
    gatewayPaymentKey = '123'
  })

  it('should render Create component', () => {
    render(<Create />)
    expect(screen.getByText(`Create`)).toBeInTheDocument()
  })

  it('should handle submit action', async () => {
    let requestedUrl = ''
    jest.spyOn(utils.localApi, 'post').mockImplementation(async (url) => {
      requestedUrl = url
    })
    jest.spyOn(utils, 'getCardBrand').mockImplementation(() => {
      return 'true'
    })
    jest.spyOn(utils, 'validateCVV').mockImplementation(() => {
      return true
    })
    render(<Create />)

    const cardHolderInput = screen.getByPlaceholderText('Cardholder')
    fireEvent.change(cardHolderInput, { target: { value: 'Aleatorio' } })

    const cardNumberInput = screen.getByPlaceholderText('Card number')
    fireEvent.change(cardNumberInput, { target: { value: '123456789012345' } })

    const expiryInput = screen.getByPlaceholderText('00/00')
    fireEvent.change(expiryInput, { target: { value: '09/29' } })

    const cvvInput = screen.getByPlaceholderText('CVV')
    fireEvent.change(cvvInput, { target: { value: '123' } })

    const submitButton = screen.getByText('Create')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(requestedUrl).toBe('/pagarme/cards/create')
      expect(toastCalls.includes('Credit card successfully added')).toBe(true)
    })
  })

  it('should break submit action because user does not hava a gateway payment key', async () => {
    gatewayPaymentKey = undefined
    jest.spyOn(utils, 'getCardBrand').mockImplementation(() => {
      return 'true'
    })
    jest.spyOn(utils, 'validateCVV').mockImplementation(() => {
      return true
    })
    render(<Create />)

    const cardHolderInput = screen.getByPlaceholderText('Cardholder')
    fireEvent.change(cardHolderInput, { target: { value: 'Aleatorio' } })

    const cardNumberInput = screen.getByPlaceholderText('Card number')
    fireEvent.change(cardNumberInput, { target: { value: '123456789012345' } })

    const expiryInput = screen.getByPlaceholderText('00/00')
    fireEvent.change(expiryInput, { target: { value: '09/29' } })

    const cvvInput = screen.getByPlaceholderText('CVV')
    fireEvent.change(cvvInput, { target: { value: '123' } })

    const submitButton = screen.getByText('Create')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(toastCalls.includes('Ops! Something wrong happened')).toBe(true)
    })
  })

  it('should break submit action because credit card number is invalid', async () => {
    jest.spyOn(utils, 'getCardBrand').mockImplementation(() => {
      return false
    })
    jest.spyOn(utils, 'validateCVV').mockImplementation(() => {
      return true
    })
    render(<Create />)

    const cardHolderInput = screen.getByPlaceholderText('Cardholder')
    fireEvent.change(cardHolderInput, { target: { value: 'Aleatorio' } })

    const cardNumberInput = screen.getByPlaceholderText('Card number')
    fireEvent.change(cardNumberInput, { target: { value: '4263982640269299' } })

    const expiryInput = screen.getByPlaceholderText('00/00')
    fireEvent.change(expiryInput, { target: { value: '09/29' } })

    const cvvInput = screen.getByPlaceholderText('CVV')
    fireEvent.change(cvvInput, { target: { value: '123' } })

    const submitButton = screen.getByText('Create')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Number invalid')).toBeInTheDocument()
    })
  })

  it('should test the yup cases', async () => {
    jest.spyOn(utils, 'getCardBrand').mockImplementation(() => {
      return false
    })
    jest.spyOn(utils, 'validateCVV').mockImplementation(() => {
      return true
    })
    render(<Create />)

    const submitButton = screen.getByText('Create')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getAllByText('This field is required').length).toBe(3)
      expect(
        screen.getByText('number must be at least 14 characters')
      ).toBeInTheDocument()
    })

    const cardHolderInput = screen.getByPlaceholderText('Cardholder')
    fireEvent.change(cardHolderInput, { target: { value: 'Aleatorio' } })

    const cardNumberInput = screen.getByPlaceholderText('Card number')
    fireEvent.change(cardNumberInput, {
      target: { value: 'abcdefghijklmno' }
    })

    waitFor(() => {
      expect(
        screen.getByText('Number must contain only numbers')
      ).toBeInTheDocument()
    })

    const expiryInput = screen.getByPlaceholderText('00/00')
    fireEvent.change(expiryInput, { target: { value: 0 } })

    waitFor(() => {
      expect(screen.getByText('Invalid date')).toBeInTheDocument()
    })

    fireEvent.change(expiryInput, { target: { value: '_' } })

    waitFor(() => {
      expect(screen.getByText('Invalid date')).toBeInTheDocument()
    })

    fireEvent.change(expiryInput, { target: { value: '17/90' } })

    waitFor(() => {
      expect(screen.getByText('Invalid date')).toBeInTheDocument()
    })

    fireEvent.change(expiryInput, { target: { value: '08/01' } })

    waitFor(() => {
      expect(screen.getByText('Invalid date')).toBeInTheDocument()
    })

    const cvvInput = screen.getByPlaceholderText('CVV')
    fireEvent.change(cvvInput, { target: { value: 'abc' } })

    waitFor(() => {
      expect(
        screen.getByText('Cvv must contain only numbers')
      ).toBeInTheDocument()
    })
  })
})
