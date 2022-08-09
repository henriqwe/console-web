import { render, screen, fireEvent } from '@testing-library/react'
import { WhiteOutline } from '.'
import '@testing-library/jest-dom'

describe('WhiteOutline', () => {
  it('should render the WhiteOutline', () => {
    render(
      <WhiteOutline
        onClick={() => null}
        loading={false}
        disabled={false}
        iconPosition={'left'}
        icon={<div data-testid="icon"/>}
      >
        Click here
      </WhiteOutline>
    )

    const buttonChildren = screen.getByText('Click here')
    const icon = screen.queryByTestId('icon')
    expect(icon).toBeInTheDocument()

    expect(buttonChildren).toBeInTheDocument()
  })

  it('should execute the click event', () => {
    let number = 5
    render(
      <WhiteOutline
        onClick={() => {
          number++
        }}
        disabled={false}
        data-testid="button"
      >
        Click here
      </WhiteOutline>
    )

    const button = screen.getByTestId('button')
    fireEvent.click(button)
    expect(number).toBe(6)
  })

  it('should show the spinner icon', () => {
    let number = 5
    render(
      <WhiteOutline
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
      </WhiteOutline>
    )

    const icon = screen.queryByTestId('icon')
    expect(icon).not.toBeInTheDocument()
  })

  it('should disable the BlueButton', () => {
    let number = 5
    render(
      <WhiteOutline
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
      </WhiteOutline>
    )

    const button = screen.getByTestId('button')
    fireEvent.click(button)
    expect(number).not.toBe(6)
  })
})
