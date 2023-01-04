import '@testing-library/jest-dom'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { TicketDetail } from './TicketDetail'
import type { Tickets } from 'domains/dashboard/DashboardContext'
import React from 'react'

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
  it('should render TicketDetail component', () => {
    render(<TicketDetail />)
    expect(
      screen.getByText(`Ticket ${mockSelectedTicket?.id}`)
    ).toBeInTheDocument()
  })

  it('should render TicketDetail title', () => {
    render(<TicketDetail />)
    expect(screen.getByText(`${mockSelectedTicket?.title}`)).toBeInTheDocument()
  })

  it('should render TicketDetail content', () => {
    render(<TicketDetail />)
    expect(
      screen.getByText(`${mockSelectedTicket?.content}`)
    ).toBeInTheDocument()
  })

  it('should set state selectedTicket undefined after click', () => {
    render(<TicketDetail />)
    const backToListButton = screen.getByText('Back to list')
    expect(backToListButton).toBeInTheDocument()

    fireEvent.click(backToListButton)

    expect(mockSelectedTicket).toEqual(undefined)
  })
})
