import '@testing-library/jest-dom'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Profile } from './Profile'
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

describe('Profile component', () => {
  afterEach(() => {
    toastCalls = []
  })

  it('should render Profile component', () => {
    render(<Profile />)
    expect(screen.getByText(`My Info`)).toBeInTheDocument()
  })

  it('should handle the submit action', async () => {
    render(<Profile />)

    const userNameField = screen.getByPlaceholderText('Username')
    fireEvent.change(userNameField, { target: { value: 'Aleatorio' } })

    const emailField = screen.getByPlaceholderText('Email')
    fireEvent.change(emailField, { target: { value: 'Aleatorio@gmail.com' } })

    const oldPassowordField = screen.getByPlaceholderText('Old Password')
    fireEvent.change(oldPassowordField, { target: { value: 'ABC1234' } })

    const passwordField = screen.getByPlaceholderText('New Password')
    fireEvent.change(passwordField, { target: { value: 'ABC1111' } })

    const passowordConfirmationField = screen.getByPlaceholderText(
      'Password Confirmation'
    )
    fireEvent.change(passowordConfirmationField, {
      target: { value: 'ABC1111' }
    })

    const mainButton = screen.getByText('Change Password')
    fireEvent.click(mainButton)

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    })
    await waitFor(() => {
      toastCalls.includes('Password changed successfully!')
    })
  })

  it('should break the submit action', async () => {
    render(<Profile />)

    const userNameField = screen.getByPlaceholderText('Username')
    fireEvent.change(userNameField, { target: { value: 'Aleatorio' } })

    const emailField = screen.getByPlaceholderText('Email')
    fireEvent.change(emailField, { target: { value: 'Aleatorio@gmail.com' } })

    const oldPassowordField = screen.getByPlaceholderText('Old Password')
    fireEvent.change(oldPassowordField, { target: { value: 'ABC1234' } })

    const passwordField = screen.getByPlaceholderText('New Password')
    fireEvent.change(passwordField, { target: { value: 'breakProcess' } })

    const passowordConfirmationField = screen.getByPlaceholderText(
      'Password Confirmation'
    )
    fireEvent.change(passowordConfirmationField, {
      target: { value: 'breakProcess' }
    })

    const mainButton = screen.getByText('Change Password')
    fireEvent.click(mainButton)

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    })
    await waitFor(() => {
      toastCalls.includes('it broke')
    })
  })

  it('should break the submit action with a different status', async () => {
    render(<Profile />)

    const userNameField = screen.getByPlaceholderText('Username')
    fireEvent.change(userNameField, { target: { value: 'Aleatorio' } })

    const emailField = screen.getByPlaceholderText('Email')
    fireEvent.change(emailField, { target: { value: 'Aleatorio@gmail.com' } })

    const oldPassowordField = screen.getByPlaceholderText('Old Password')
    fireEvent.change(oldPassowordField, { target: { value: 'ABC1234' } })

    const passwordField = screen.getByPlaceholderText('New Password')
    fireEvent.change(passwordField, { target: { value: 'differentStatus' } })

    const passowordConfirmationField = screen.getByPlaceholderText(
      'Password Confirmation'
    )
    fireEvent.change(passowordConfirmationField, {
      target: { value: 'differentStatus' }
    })

    const mainButton = screen.getByText('Change Password')
    fireEvent.click(mainButton)

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    })
    await waitFor(() => {
      toastCalls.includes('it broke with different status')
    })
  })
})
