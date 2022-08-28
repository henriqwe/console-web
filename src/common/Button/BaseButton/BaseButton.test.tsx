import { render, screen, fireEvent } from '@testing-library/react'
import { BaseButton } from './'
import '@testing-library/jest-dom'

describe('BaseButton', () => {
  it('should render the BaseButton', () => {
    render(
      <BaseButton
        onClick={() => null}
        loading={false}
        disabled={false}
        buttonColor="bg-blue-500"
        hoverButtonColor="hover:bg-blue-600"
        disableButtonColor="disabled:bg-blue-400"
        iconPosition={'left'}
        icon={<div data-testid="icon"/>}
      >
        Click here
      </BaseButton>
    )

    const buttonChildren = screen.getByText('Click here')
    const icon = screen.queryByTestId('icon')
    expect(icon).toBeInTheDocument()

    expect(buttonChildren).toBeInTheDocument()
    expect(buttonChildren).toHaveClass('bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400')
  })

  it('should execute the click event', () => {
    let number = 5
    render(
      <BaseButton
        onClick={() => {
          number++
        }}
        disabled={false}
        buttonColor="bg-blue-500"
        hoverButtonColor="hover:bg-blue-600"
        disableButtonColor="disabled:bg-blue-400"
        textColor="text-white"
        data-testid="button"
      >
        Click here
      </BaseButton>
    )

    const button = screen.getByTestId('button')
    fireEvent.click(button)
    expect(number).toBe(6)
  })

  it('should show the spinner icon', () => {
    let number = 5
    render(
      <BaseButton
        onClick={() => {
          number++
        }}
        loading={true}
        disabled={false}
        buttonColor="bg-blue-500"
        hoverButtonColor="hover:bg-blue-600"
        disableButtonColor="disabled:bg-blue-400"
        textColor="text-white"
        iconPosition={'right'}
        icon={<div data-testid="icon"/>}
        data-testid="button"
      >
        Click here
      </BaseButton>
    )

    const icon = screen.queryByTestId('icon')
    expect(icon).not.toBeInTheDocument()
  })

  it('should disable the BaseButton', () => {
    let number = 5
    render(
      <BaseButton
        onClick={() => {
          number++
        }}
        loading={true}
        disabled={true}
        buttonColor="bg-blue-500"
        hoverButtonColor="hover:bg-blue-600"
        disableButtonColor="disabled:bg-blue-400"
        textColor="text-white"
        iconPosition={'right'}
        icon={<div data-testid="icon"/>}
        data-testid="button"
      >
        Click here
      </BaseButton>
    )

    const button = screen.getByTestId('button')
    fireEvent.click(button)
    expect(number).not.toBe(6)
  })
})
