import '@testing-library/jest-dom'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { TicketDetail } from './TicketDetail'
import type { Tickets } from 'domains/dashboard/DashboardContext'
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

jest.mock('utils/api', () => ({
  localApi: {
    get: jest.fn(),
    post: jest.fn()
  }
}))

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ test: 100 })
  })
) as jest.Mock

let mockSelectedTicket: Tickets = {
  id: 1,
  category: 'fake-catogory',
  content: 'fake-content',
  status: 'success',
  logversion: 0,
  project: 'fake-project',
  title: 'fake-title'
}
const mockSetSelectedTicket = jest.fn((value: Tickets) => {
  mockSelectedTicket = value
})

jest.mock('domains/dashboard/DashboardContext', () => ({
  ...jest.requireActual('domains/dashboard/DashboardContext'),
  useData: () => ({
    selectedTicket: mockSelectedTicket,
    setSelectedTicket: mockSetSelectedTicket
  })
}))

describe('TicketDetail component', () => {
  it('should render TicketDetail component', async () => {
    render(<TicketDetail />)

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    })
    expect(
      screen.getByText(`Ticket ${mockSelectedTicket?.id}`)
    ).toBeInTheDocument()
  })

  it('should render TicketDetail title', async () => {
    render(<TicketDetail />)
    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    })
    expect(screen.getByText(`${mockSelectedTicket?.title}`)).toBeInTheDocument()
  })

  it('should render TicketDetail content', async () => {
    render(<TicketDetail />)
    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    })
    expect(
      screen.getByText(`${mockSelectedTicket?.content}`)
    ).toBeInTheDocument()
  })

  it('should test load messages action', async () => {
    let requestedUrl = ''
    jest.spyOn(utils.localApi, 'get').mockImplementation(async (url) => {
      requestedUrl = url

      return {
        data: [
          {
            message: [
              {
                content: 'message 1',
                id: '123',
                date: 'string',
                name: 'string',
                createdbyuser: false
              },
              {
                content: 'message 2',
                id: '321',
                date: 'string',
                name: 'string',
                createdbyuser: true
              }
            ]
          }
        ]
      }
    })

    const { container } = render(
      <TicketDetail
        user={{
          id: 123,
          email: 'user@user.com',
          username: 'Aleatorio'
        }}
      />
    )

    expect(container).toBeInTheDocument()

    await waitFor(() => {
      expect(requestedUrl).toBe('/support/message')
      expect(screen.getByText('Ycodify')).toBeInTheDocument()
      expect(screen.getByText('Aleatorio')).toBeInTheDocument()
    })
  })

  it('should break load messages action', async () => {
    jest.spyOn(utils.localApi, 'get').mockImplementation(async (url) => {
      throw new Error('it broke')
    })

    const { container } = render(<TicketDetail />)

    expect(container).toBeInTheDocument()

    await waitFor(() => {
      expect(toastCalls.includes('it broke')).toBe(true)
    })
  })

  it('should handle submit action', async () => {
    let requestedUrl = ''
    jest.spyOn(utils.localApi, 'get').mockImplementation(async (url) => {
      requestedUrl = url

      return {
        data: []
      }
    })
    const post = jest
      .spyOn(utils.localApi, 'post')
      .mockImplementation(async (url) => {
        requestedUrl = url
      })

    const { container } = render(
      <TicketDetail
        user={{
          id: 123,
          email: 'user@user.com',
          username: 'Aleatorio'
        }}
      />
    )

    expect(container).toBeInTheDocument()

    await waitFor(() => {
      expect(requestedUrl).toBe('/support/message')
    })

    const submitButton = screen.getByText('Send')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('this field is required')).toBeInTheDocument()
      expect(post).not.toBeCalled()
    })

    const textarea = screen.getByPlaceholderText('Enter a new message here...')
    fireEvent.change(textarea, { target: { value: 'new message' } })

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(requestedUrl).toBe('/support/message')
    })
  })

  it('should break submit action', async () => {
    let requestedUrl = ''
    jest.spyOn(utils.localApi, 'get').mockImplementation(async (url) => {
      requestedUrl = url

      return {
        data: []
      }
    })
    jest.spyOn(utils.localApi, 'post').mockImplementation(async () => {
      throw new Error('it broke')
    })

    const { container } = render(
      <TicketDetail
        user={{
          id: 123,
          email: 'user@user.com',
          username: 'Aleatorio'
        }}
      />
    )

    expect(container).toBeInTheDocument()

    await waitFor(() => {
      expect(requestedUrl).toBe('/support/message')
    })

    const submitButton = screen.getByText('Send')

    const textarea = screen.getByPlaceholderText('Enter a new message here...')
    fireEvent.change(textarea, { target: { value: 'new message' } })

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(toastCalls.includes('it broke')).toBe(true)
    })
  })
})
