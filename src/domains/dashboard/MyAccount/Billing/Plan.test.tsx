import '@testing-library/jest-dom'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Plan } from './Plan'
import React from 'react'

export const plan = {
  name: 'Sandbox',
  price: 'R$0,00',
  description: 'Small scale',
  href: 'https://console.ycodify.com/register',
  features: [
    'Data models: 1',
    'Graphic modeling',
    'Monthly deductible: 500 MB',
    '60 requests per minute',
    'Community support',
    'SLA: 48h to reply'
  ],
  detail: ''
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

jest.mock('domains/dashboard/MyAccount/services/changePassword', () => ({
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

describe('Plan component', () => {
  afterEach(() => {
    toastCalls = []
  })

  it('should render Plan component', () => {
    render(
      <Plan
        name={plan.name}
        price={plan.price}
        description={plan.description}
        href={plan.href}
        features={plan.features}
        detail={plan.detail}
        selectedPlan={false}
      />
    )

    const planName = screen.getByText(`Sandbox`)
    expect(planName).toBeInTheDocument()

    const featureList = screen.getByRole('list')
    expect(featureList.childElementCount).toBe(6)

    const comingSoonButton = screen.getByText('Coming soon...')
    expect(comingSoonButton).toBeInTheDocument()
  })

  it('should render Plan component with the selected plan', () => {
    const { container } = render(
      <Plan
        name={plan.name}
        price={plan.price}
        description={plan.description}
        href={plan.href}
        features={plan.features}
        detail={plan.detail}
        selectedPlan={true}
      />
    )

    expect(container.firstChild).toHaveClass(
      'order-first lg:order-none bg-gradient-to-r from-yc via-yc-brighter to-yc'
    )

    const comingSoonButton = screen.getByText('Selected')
    expect(comingSoonButton).toBeInTheDocument()
  })
})
