import '@testing-library/jest-dom'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Billing } from './Billing'
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

jest.mock('services/ycodify/account/changePassword', () => ({
  changePassword: ({ password }: { password: string }) => {
    if (password === 'breakProcess') {
      throw { response: { data: { message: 'it broke' } } }
    }

    if (password === 'differentStatus') {
      return {
        status: 400,
        data: { message: 'it broke with different status' }
      }
    }
    return {
      status: 200
    }
  }
}))

describe('Billing component', () => {
  afterEach(() => {
    toastCalls = []
  })

  it('should render Billing component', async () => {
    jest.useFakeTimers()
    render(<Billing />)

    const billingHistoryText = screen.getByText(`Billing history`)
    expect(billingHistoryText).toBeInTheDocument()
   
    expect(billingHistoryText.parentElement?.lastChild?.firstChild).toHaveClass('animate-spin')

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
        jest.runOnlyPendingTimers()
      })
    })

    const notFound = screen.getByText(`Billing history not found`)
    expect(notFound).toBeInTheDocument()
  })
})
