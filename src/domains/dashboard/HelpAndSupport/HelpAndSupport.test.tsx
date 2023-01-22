import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { HelpAndSupport } from './HelpAndSupport'
import React from 'react'
import * as utils from 'utils'

type Tickets = {
  logversion: number
  id: number
  project: string
  category: string
  title: string
  status: string
  content: string
}

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
let tickets: Tickets[] = []
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
    tickets,
    setTickets: jest.fn((val) => setTickets(val)),
    selectedTicket,
    setSelectedTicket: jest.fn((val) => setSelectedTicket(val))
  })
}))

describe('HelpAndSupport component', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }
  })
  afterEach(() => {
    toastCalls = []
    gatewayPaymentKey = '123'
    selectedTicket = 'ticket'
    process.env = OLD_ENV
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
              { date: new Date(), status: 'Active' }
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

  it('should test create ticket action', async () => {
    selectedTicket = undefined
    let requestedUrl = ''
    jest.spyOn(utils.localApi, 'get').mockImplementation(async (url) => {
      requestedUrl = url
      return {
        data: [
          {
            ticket: []
          }
        ]
      }
    })

    const { container } = render(<HelpAndSupport />)
    expect(container.firstChild).toBeInTheDocument()

    await waitFor(() => {
      expect(requestedUrl).toBe('/support/ticket')
    })

    const createButton = screen.getByText('Create')
    fireEvent.click(createButton)

    expect(setSlideType).toBeCalledWith('createTicket')
    expect(setOpenSlide).toBeCalledWith(true)
    expect(setSlideSize).toBeCalledWith('normal')
  })

  it('should test back to ticket list action', async () => {
    let requestedUrl = ''
    jest.spyOn(utils.localApi, 'get').mockImplementation(async (url) => {
      requestedUrl = url
      return {
        data: [
          {
            ticket: []
          }
        ]
      }
    })

    const { container } = render(<HelpAndSupport />)
    expect(container.firstChild).toBeInTheDocument()

    await waitFor(() => {
      expect(requestedUrl).toBe('/support/ticket')
    })

    const backButton = screen.getByText('Back')
    fireEvent.click(backButton)

    expect(setSelectedTicket).toBeCalledWith(undefined)
  })

  it('should break loadTickets action', async () => {
    jest.spyOn(utils.localApi, 'get').mockImplementation(async (url) => {
      throw new Error('it broke')
    })

    const { container } = render(<HelpAndSupport />)
    expect(container.firstChild).toBeInTheDocument()

    await waitFor(() => {
      expect(toastCalls.includes('it broke')).toBe(true)
    })
  })

  it('should render HelpAndSupport without selectedTicket', async () => {
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL = 'test@example.com'
    selectedTicket = undefined
    tickets = [
      {
        id: 123,
        title: 'ticket1',
        project: 'library',
        category: 'error',
        content: '123',
        logversion: 0,
        status: 'Active'
      }
    ]
    setTickets.mockImplementation((val) => {
      tickets = val
    })
    jest.spyOn(utils.localApi, 'get').mockImplementation(async (url) => {
      return {
        data: []
      }
    })

    const { container } = render(<HelpAndSupport />)
    expect(container.firstChild).toBeInTheDocument()

    await waitFor(() => {
      expect(tickets.length).toBe(1)
      expect(screen.getByText('ticket1')).toBeInTheDocument()
    })
  })
})
