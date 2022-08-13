import { render, screen } from '@testing-library/react'
import { ClearModal } from '.'
import '@testing-library/jest-dom'

describe('ClearModal', () => {
  it('should render the ClearModal', () => {
    render(
      <ClearModal open setOpen={jest.fn}>
        ClearModal
      </ClearModal>
    )

    const clearModalChildren = screen.getByText('ClearModal')

    expect(clearModalChildren).toBeInTheDocument()
  })

  it('should not render the ClearModal content', () => {
    render(
      <ClearModal open={false} setOpen={jest.fn}>
        ClearModal
      </ClearModal>
    )

    const clearModalChildren = screen.queryByText('ClearModal')

    expect(clearModalChildren).not.toBeInTheDocument()
  })
})
