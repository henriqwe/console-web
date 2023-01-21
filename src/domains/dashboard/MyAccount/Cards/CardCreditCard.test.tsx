import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { CardCreditCard } from './CardCreditCard'
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

let loading = true
let deleteCard = jest.fn()
let getCards = jest.fn()
jest.mock('domains/dashboard/MyAccount/Cards/CreditCardContext', () => ({
  useData: () => ({
    getCards: jest.fn(() => getCards()),
    deleteCard: jest.fn((val) => deleteCard(val)),
    loading,
    openSlide: false,
    cardsData: [
      {
        brand: 'string',
        created_at: 'string',
        exp_month: 0,
        exp_year: 0,
        first_six_digits: 'string',
        holder_name: 'string',
        id: 'string',
        last_four_digits: 'string',
        status: 'string',
        type: 'string',
        updated_at: 'string'
      }
    ]
  })
}))

let gatewayPaymentKey: undefined | string = '123'
jest.mock('contexts/UserContext', () => ({
  useUser: () => ({
    user: {
      gatewayPaymentKey,
      username: 'Aleatorio',
      email: 'alatorio@alatorio.com',
      addrStreet: 'bla',
      addrNumber: 12,
      addrCountry: 'Country',
      addrDistrict: 'bla',
      addrCity: 'bla',
      addrZip: 'bla',
      status: 0
    }
  })
}))

describe('CardCreditCard component', () => {
  afterEach(() => {
    toastCalls = []
    gatewayPaymentKey = '123'
  })

  it('should render CardCreditCard component', () => {
    render(
      <CardCreditCard
        brand={'string'}
        created_at={'string'}
        exp_month={12}
        exp_year={2000}
        first_six_digits={'string'}
        holder_name={'string'}
        id={'string'}
        last_four_digits={'string'}
        status={'string'}
        type={'string'}
        updated_at={'string'}
      />
    )
    expect(screen.getByText(`Created at`)).toBeInTheDocument()
    expect(screen.getByText('Set default')).toBeInTheDocument()
  })

  it('should render CardCreditCard component with a specific card id', () => {
    render(
      <CardCreditCard
        brand={'string'}
        created_at={'string'}
        exp_month={12}
        exp_year={2000}
        first_six_digits={'string'}
        holder_name={'string'}
        id={'card_VJP4q98JuvfKM9wO'}
        last_four_digits={'string'}
        status={'string'}
        type={'string'}
        updated_at={'string'}
      />
    )

    expect(screen.getByTestId('starIcon')).toBeInTheDocument()
  })

  it('should handle handleDeleteCard action', async () => {
    render(
      <CardCreditCard
        brand={'string'}
        created_at={'string'}
        exp_month={12}
        exp_year={2000}
        first_six_digits={'string'}
        holder_name={'string'}
        id={'string'}
        last_four_digits={'string'}
        status={'string'}
        type={'string'}
        updated_at={'string'}
      />
    )
    const trashIcon = screen.getByTestId('trashIcon')
    fireEvent.click(trashIcon)

    const submitButton = screen.getByText('Close').parentElement?.firstChild
    fireEvent.click(submitButton as ChildNode)

    await waitFor(() => {
      expect(deleteCard).toBeCalled()
      expect(getCards).toBeCalled()
      expect(toastCalls.includes('Credit card removed successfully')).toBe(true)
    })
  })
})
