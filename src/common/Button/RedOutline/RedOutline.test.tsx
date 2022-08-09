import { render, screen, fireEvent } from '@testing-library/react'
import { RedOutline } from '.'
import '@testing-library/jest-dom'

describe('RedOutline', () => {
  it('should render the RedOutline', () => {
    render(
      <RedOutline
        onClick={() => null}
        loading={false}
        disabled={false}
        iconPosition={'left'}
        icon={<div data-testid="icon"/>}
      >
        Click here
      </RedOutline>
    )

    const buttonChildren = screen.getByText('Click here')
    const icon = screen.queryByTestId('icon')
    expect(icon).toBeInTheDocument()

    expect(buttonChildren).toBeInTheDocument()
  })

  it('should execute the click event', () => {
    let number = 5
    render(
      <RedOutline
        onClick={() => {
          number++
        }}
        disabled={false}
        data-testid="button"
      >
        Click here
      </RedOutline>
    )

    const button = screen.getByTestId('button')
    fireEvent.click(button)
    expect(number).toBe(6)
  })

  it('should show the spinner icon', () => {
    let number = 5
    render(
      <RedOutline
        onClick={() => {
          number++
        }}
        loading={true}
        disabled={false}
        iconPosition={'right'}
        icon={<div data-testid="icon"/>}
        data-testid="button"
      >
        Click here
      </RedOutline>
    )

    const icon = screen.queryByTestId('icon')
    expect(icon).not.toBeInTheDocument()
  })

  it('should disable the BlueButton', () => {
    let number = 5
    render(
      <RedOutline
        onClick={() => {
          number++
        }}
        loading={true}
        disabled={true}
        iconPosition={'right'}
        icon={<div data-testid="icon"/>}
        data-testid="button"
      >
        Click here
      </RedOutline>
    )

    const button = screen.getByTestId('button')
    fireEvent.click(button)
    expect(number).not.toBe(6)
  })
})
