import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { RowActions } from './RowActions'
import * as dashboard from 'domains/dashboard'

import type { Tickets } from 'domains/dashboard/DashboardContext'
import React from 'react'

let mockSelectedTicket: Tickets
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

describe('RowActions component', () => {
  const item: Tickets = {
    id: 1,
    category: 'fake-catogory',
    content: 'fake-content',
    status: 'success',
    logversion: 0,
    project: 'fake-project',
    title: 'fake-title'
  }

  it('should render RowActions component', () => {
    const { getByTestId } = render(
      <table>
        <tbody>
          <tr>
            <RowActions item={item} />
          </tr>
        </tbody>
      </table>
    )
    expect(getByTestId('button-View')).toBeInTheDocument()
  })
  it('should set state selectedTicket after click', () => {
    const { getByTestId } = render(
      <dashboard.DataProvider>
        <table>
          <tbody>
            <tr>
              <RowActions item={item} />
            </tr>
          </tbody>
        </table>
      </dashboard.DataProvider>
    )
    expect(getByTestId('button-View')).toBeInTheDocument()
    const button = screen.getByTestId('button-View')
    fireEvent.click(button)
    expect(mockSelectedTicket).toEqual(item)
  })
})
