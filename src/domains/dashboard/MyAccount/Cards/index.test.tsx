import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Cards } from './'
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
jest.mock('domains/dashboard/MyAccount/Cards/CreditCardContext', () => ({
  useData: () => ({
    getCards: () => null,
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

jest.mock('iso-3166-1', () => ({
  whereAlpha2: () => ({
    alpha2: 'string',
    alpha3: 'string',
    country: 'Country',
    numeric: '1'
  }),
  all: () => []
}))

jest.mock('iso-3166-2', () => ({
  data:{
    string:{
      sub:{
        bla:{
          name: 'bla'
        }
      }
    }
  },
  country: (val:string) => ({
    sub:{
      bla:{
        name: 'bla'
      }
    }
  })
}))

describe('Cards component', () => {
  afterEach(() => {
    toastCalls = []
    gatewayPaymentKey = '123'
  })

  it('should render Cards component', () => {
    render(<Cards />)
    expect(screen.getByText(`Your credit cards`)).toBeInTheDocument()
    expect(screen.getByTestId(`spinner`)).toBeInTheDocument()
  })

  it('should render Cards component without loading status', () => {
    loading = false
    render(<Cards />)

    expect(screen.getByText('Created at')).toBeInTheDocument()

  })
})
