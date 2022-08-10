import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from '.'
import '@testing-library/jest-dom'

describe('Modal', () => {
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
})
