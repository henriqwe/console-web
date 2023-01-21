import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { HelpAndSupport } from './HelpAndSupport'
import React from 'react'
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
      gatewayPaymentKey,
      userData: {
        id: '123',
        email: 'test@example.com',
        username: 'username'
      },
      email: 'test@example.com'
    },
    setUser: () => null
  })
}))

let setOpenSlide = jest.fn()
let setSlideType = jest.fn()
let setSlideSize = jest.fn()
let setTickets = jest.fn()
let selectedTicket: string | undefined = 'ticket'
let setSelectedTicket = jest.fn()
jest.mock('domains/dashboard/DashboardContext', () => ({
  useData: () => ({
    openSlide: false,
    slideType: 'createProject',
    selectedSchema: { name: 'title' },
    slideSize: 'normal',

    setOpenSlide: jest.fn((val) => setOpenSlide(val)),
    setSlideType: jest.fn((val) => setSlideType(val)),
    setSlideSize: jest.fn((val) => setSlideSize(val)),
    reload: false,
    tickets: [],
    setTickets: jest.fn((val) => setTickets(val)),
    selectedTicket,
    setSelectedTicket: jest.fn((val) => setSelectedTicket(val))
  })
}))

describe('HelpAndSupport component', () => {
  afterEach(() => {
    toastCalls = []
    gatewayPaymentKey = '123'
  })

  it('should render HelpAndSupport component', async () => {
    let requestedUrl = ''
    jest.spyOn(utils.localApi, 'get').mockImplementation(async (url) => {
      requestedUrl = url

      return {
        data: [
          {
            ticket: [
              { date: new Date(), status: 'Active' },
              { date: new Date(), status: 'Inactive' },
              { date: new Date(), status: 'Inactive' },
              { date: new Date(), status: 'Active' },
            ]
          }
        ]
      }
    })

    const { container } = render(<HelpAndSupport />)
    expect(container.firstChild).toBeInTheDocument()

    await waitFor(() => {
      expect(requestedUrl).toBe('/support/ticket')
    })
  })
})
