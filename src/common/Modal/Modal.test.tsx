import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from '.'
import '@testing-library/jest-dom'

describe('Modal', () => {
  const mock = function () {
    return {
      observe: jest.fn(),
      disconnect: jest.fn()
    }
  }

  //--> assign mock directly without jest.fn
  window.IntersectionObserver = mock as any
  it('should render the Modal', () => {
    const { container } = render(
      <Modal
        buttonTitle=""
        handleSubmit={jest.fn}
        title=""
        open={true}
        setOpen={jest.fn}
      />
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render the Modal but without content', () => {
    const { container } = render(
      <Modal
        buttonTitle=""
        handleSubmit={jest.fn}
        title=""
        open={false}
        setOpen={jest.fn}
      />
    )
    expect(container.firstChild).not.toBeInTheDocument()
  })

  it('should render the Modal with correct title and description', () => {
    render(
      <Modal
        buttonTitle="confirm"
        description="description of test 1"
        handleSubmit={jest.fn}
        title="test"
        open={true}
        setOpen={jest.fn}
      />
    )

    const modalButtonTitle = screen.queryByText('test')
    expect(modalButtonTitle).toBeInTheDocument()

    const description = screen.getByText('description of test 1')
    expect(description).toBeInTheDocument()
  })

  it('should handle the correct action when clicked the button', () => {
    let number = 5
    render(
      <Modal
        buttonTitle="confirm"
        description="description of test 1"
        handleSubmit={() => {
          number++
        }}
        title="test"
        open={true}
        setOpen={jest.fn}
      />
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(number).toBe(6)
  })

  it('should hide the modal when clicked the cancel button', () => {
    const { rerender } = render(
      <Modal
        buttonTitle="confirm"
        description="description of test 1"
        handleSubmit={jest.fn}
        title="test"
        open={true}
        setOpen={jest.fn}
      />
    )

    const cancelButton = screen.getByRole('cancelButton')
    fireEvent.click(cancelButton)

    rerender(
      <Modal
        buttonTitle="confirm"
        description="description of test 1"
        handleSubmit={jest.fn}
        title="test"
        open={false}
        setOpen={jest.fn}
      />
    )

    const modalTitle = screen.queryByText('test')
    expect(modalTitle).not.toBeInTheDocument()
  })

  it('should render the Modal with loading state', () => {
    render(
      <Modal
        buttonTitle="confirm"
        description="description of test 1"
        handleSubmit={jest.fn}
        title="test"
        open={true}
        loading
        setOpen={jest.fn}
      />
    )

    const actionButton = screen.getByRole('button')
    expect(actionButton.firstChild).toHaveClass('w-4 h-4')
  })
})
