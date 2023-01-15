import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { Column } from './Column'
import '@testing-library/jest-dom'

const mock = function () {
  return {
    observe: jest.fn(),
    disconnect: jest.fn()
  }
}

//--> assign mock directly without jest.fn
window.IntersectionObserver = mock as any

jest.mock('utils/api', () => ({
  api: {
    put: jest.fn(),
    post: jest.fn(),
    delete: jest.fn()
  }
}))

describe('Column', () => {
  afterEach(() => {})

  it('should render Column component', () => {
    const { container } = render(
      <Column
        data={{
          name: 'name',
          comment: 'string',
          createdAt: 0,
          isIndex: false,
          nullable: false,
          unique: false,
          length: 0,
          type: 'string'
        }}
      />
    )

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render ModifyTab component without edit button', () => {
    render(
      <Column
        data={{
          name: 'name',
          comment: 'string',
          createdAt: 0,
          isIndex: true,
          nullable: true,
          unique: true,
          length: 0,
          type: 'string'
        }}
        noEdit
      />
    )

    const editButton = screen.queryByTestId('edit')
    expect(editButton).not.toBeInTheDocument()
  })

  it('should show field detail', () => {
    render(
      <Column
        data={{
          name: 'name',
          comment: 'string',
          createdAt: 0,
          isIndex: true,
          nullable: true,
          unique: true,
          length: 0,
          type: 'string'
        }}
      />
    )

    const editButton = screen.getByTestId('edit')
    fireEvent.click(editButton)

    const closeButton = screen.getByText('Close')
    expect(closeButton).toBeInTheDocument()
  })
})
