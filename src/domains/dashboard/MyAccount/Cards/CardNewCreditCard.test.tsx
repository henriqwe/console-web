import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { CardNewCreditCard } from './CardNewCreditCard'
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

let setOpenSlide = jest.fn()
let setSlideType = jest.fn()
let setSlideSize = jest.fn()
jest.mock('domains/dashboard/MyAccount/Cards/CreditCardContext', () => ({
  useData: () => ({
    setOpenSlide: jest.fn((val) => setOpenSlide(val)),
    setSlideType: jest.fn((val) => setSlideType(val)),
    setSlideSize: jest.fn((val) => setSlideSize(val))
  })
}))

let addrCity: undefined | string = 'bla'
jest.mock('contexts/UserContext', () => ({
  useUser: () => ({
    user: {
      userData: {
        username: 'Aleatorio',
        email: 'alatorio@alatorio.com',
        addrStreet: 'bla',
        addrNumber: 12,
        addrCountry: 'Country',
        addrDistrict: 'bla',
        addrCity,
        addrZip: 'bla',
        status: 0
      }
    }
  })
}))

describe('CardNewCreditCard component', () => {
  afterEach(() => {
    toastCalls = []
    addrCity = 'bla'
  })

  it('should render CardNewCreditCard component', () => {
    render(<CardNewCreditCard />)
    expect(screen.getByText(`Add new card`)).toBeInTheDocument()
  })

  it('should handle add new card action', async () => {
    render(<CardNewCreditCard />)

    const addNewCard = screen.getByText(`Add new card`)
    fireEvent.click(addNewCard)

    await waitFor(() => {
      expect(setOpenSlide).toBeCalledWith(true)
      expect(setSlideType).toBeCalledWith('createCreditCard')
      expect(setSlideSize).toBeCalledWith('normal')
    })
  })

  it('should block add new card action', () => {
    addrCity = undefined
    render(<CardNewCreditCard />)

    const addNewCard = screen.getByText(`Add new card`)
    fireEvent.click(addNewCard)

    expect(
      toastCalls.includes('Please complete the address registration')
    ).toBe(true)
  })
})
