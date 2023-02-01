import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { DataProvider, useData } from './CreditCardContext'
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
    }
  })
}))

describe('CreditCardContext component', () => {
  afterEach(() => {
    toastCalls = []
    gatewayPaymentKey = '123'
  })

  it('should render CreditCardContext component', () => {
    const Component = () => {
      const { slideType } = useData()

      return <div>{slideType}</div>
    }

    render(
      <DataProvider>
        <Component />
      </DataProvider>
    )
    expect(screen.getByText(`createCreditCard`)).toBeInTheDocument()
  })

  it('should handle getCards function', async () => {
    let requestedUrl = ''
    jest.spyOn(utils.localApi, 'get').mockImplementation(async (url) => {
      requestedUrl = url

      return {
        data: [{ id: '123', brand: 'brand' }]
      }
    })

    const Component = () => {
      const { getCards, cardsData } = useData()

      useEffect(() => {
        getCards()
      }, [])

      return (
        <div>
          {cardsData.map((card) => (
            <p key={card.id}>{card.brand}</p>
          ))}
        </div>
      )
    }

    render(
      <DataProvider>
        <Component />
      </DataProvider>
    )

    await waitFor(() => {
      expect(requestedUrl).toBe('/pagarme/cards/list?customerId=123')
      expect(screen.getByText('brand')).toBeInTheDocument()
    })
  })

  it('should break getCards function', async () => {
    gatewayPaymentKey = undefined

    const Component = () => {
      const { getCards, cardsData } = useData()

      useEffect(() => {
        getCards()
      }, [])

      return (
        <div>
          {cardsData.map((card) => (
            <p key={card.id}>{card.brand}</p>
          ))}
        </div>
      )
    }

    render(
      <DataProvider>
        <Component />
      </DataProvider>
    )

    await waitFor(() => {
      expect(toastCalls.includes('Unable to load credit cards')).toBe(true)
    })
  })

  it('should handle deleteCard function', async () => {
    let requestedUrl = ''
    jest.spyOn(utils.localApi, 'post').mockImplementation(async (url) => {
      requestedUrl = url
    })

    const Component = () => {
      const { deleteCard, cardsData } = useData()

      useEffect(() => {
        deleteCard('123')
      }, [])

      return (
        <div>
          {cardsData.map((card) => (
            <p key={card.id}>{card.brand}</p>
          ))}
        </div>
      )
    }

    render(
      <DataProvider>
        <Component />
      </DataProvider>
    )

    await waitFor(() => {
      expect(requestedUrl).toBe('/pagarme/cards/delete')
    })
  })

  it('should break deleteCard function', async () => {
    jest.spyOn(utils.localApi, 'post').mockImplementation(async (url) => {
      throw new Error('it broke')
    })

    const Component = () => {
      const { deleteCard, cardsData } = useData()

      useEffect(() => {
        deleteCard('123')
      }, [])

      return (
        <div>
          {cardsData.map((card) => (
            <p key={card.id}>{card.brand}</p>
          ))}
        </div>
      )
    }

    render(
      <DataProvider>
        <Component />
      </DataProvider>
    )

    await waitFor(() => {
      expect(toastCalls.includes('it broke')).toBe(true)
    })
  })
})
