import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import ChangePassword from './change-password'
import React from 'react'

let pushedRouter = ''
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: (val: string) => {
      pushedRouter = val
    }
  })
}))

describe('ChangePassword', () => {
  it('should render ChangePassword', async () => {
    const { container } = render(<ChangePassword />)

    expect(container.firstChild).toBeInTheDocument()
  })
})
