import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { FromAddress } from './FromAddress'
import React, { useEffect } from 'react'
import * as utils from 'utils'

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

let gatewayPaymentKey: string | undefined = '123'
jest.mock('contexts/UserContext', () => ({
  useUser: () => ({
    user: {
      gatewayPaymentKey
    },
    setUser: () => null
  })
}))

jest.mock('iso-3166-1', () => ({
  whereAlpha2: () => ({
    alpha2: 'string',
    alpha3: 'string',
    country: 'Countryyy',
    numeric: '1'
  }),
  all: () => [
    {
      alpha2: 'BR',
      alpha3: 'string',
      country: 'Brasil',
      numeric: '1'
    }
  ]
}))

jest.mock('iso-3166-2', () => ({
  data: {
    string: {
      sub: {
        bla: {
          name: 'bla'
        }
      }
    },
    BR: {
      sub: {
        bla: {
          name: 'blabla'
        }
      }
    }
  },
  country: (val: string) => ({
    sub: {
      bla: {
        name: 'bla'
      }
    }
  })
}))

describe('FromAddress component', () => {
  afterEach(() => {
    toastCalls = []
    gatewayPaymentKey = '123'
  })

  it('should render FromAddress component', () => {
    const { container } = render(<FromAddress />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should handle submit action', async () => {
    let requestedUrl: string[] = []
    jest.spyOn(utils.api, 'post').mockImplementation(async (url) => {
      requestedUrl.push(url)

      return { status: 200 }
    })

    jest.spyOn(utils.api, 'get').mockImplementation(async (url) => {
      requestedUrl.push(url)
      return {
        data: []
      }
    })

    render(<FromAddress />)

    const streetInput = screen.getByPlaceholderText('Street')
    fireEvent.change(streetInput, { target: { value: 'Rua a' } })

    const numberInput = screen.getByPlaceholderText('Number')
    fireEvent.change(numberInput, { target: { value: 123 } })

    const countrySelect = screen.getByText('Countryyy')
    fireEvent.click(countrySelect)

    const countryOption = screen.getByText('Brasil')
    fireEvent.click(countryOption)

    const districtSelect = screen.getByText('blabla')
    fireEvent.click(districtSelect)

    const districtOption = screen.getByText('bla')
    fireEvent.click(districtOption)

    const cityInput = screen.getByPlaceholderText('City')
    fireEvent.change(cityInput, { target: { value: 'Cidade' } })

    const zipCodeInput = screen.getByPlaceholderText('Zip Code')
    fireEvent.change(zipCodeInput, { target: { value: '12345678' } })

    const submitButton = screen.getByText('Update Address')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(requestedUrl[0]).toBe('v0/id/account/update')
      expect(requestedUrl[1]).toBe('v0/id/account/get')
      expect(toastCalls.includes('Address updated successfully!')).toBe(true)
    })
  })

  it('should broke submit action', async () => {
    let requestedUrl: string[] = []
    jest.spyOn(utils.api, 'post').mockImplementation(async (url) => {
      requestedUrl.push(url)

      return { data: { message: 'it broke' }, status: 400 }
    })

    render(<FromAddress />)

    const streetInput = screen.getByPlaceholderText('Street')
    fireEvent.change(streetInput, { target: { value: 'Rua a' } })

    const numberInput = screen.getByPlaceholderText('Number')
    fireEvent.change(numberInput, { target: { value: 123 } })

    const countrySelect = screen.getByText('Countryyy')
    fireEvent.click(countrySelect)

    const countryOption = screen.getByText('Brasil')
    fireEvent.click(countryOption)

    const districtSelect = screen.getByText('blabla')
    fireEvent.click(districtSelect)

    const districtOption = screen.getByText('bla')
    fireEvent.click(districtOption)

    const cityInput = screen.getByPlaceholderText('City')
    fireEvent.change(cityInput, { target: { value: 'Cidade' } })

    const zipCodeInput = screen.getByPlaceholderText('Zip Code')
    fireEvent.change(zipCodeInput, { target: { value: '12345678' } })

    const submitButton = screen.getByText('Update Address')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(requestedUrl[0]).toBe('v0/id/account/update')
      expect(toastCalls.includes('it broke')).toBe(true)
    })
  })
})
