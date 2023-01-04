import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
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

describe('Profile component', () => {
  it('should render Profile component', () => {
    render(<Profile />)
    expect(screen.getByText(`My Info`)).toBeInTheDocument()
  })
})
