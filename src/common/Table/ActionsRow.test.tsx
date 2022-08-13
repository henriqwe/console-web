import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ActionsRow } from '.'
import '@testing-library/jest-dom'
import Router from 'next/router'
jest.mock('next/router', () => ({ push: jest.fn() }))

describe('ActionsRow', () => {
  const mock = function () {
    return {
      observe: jest.fn(),
      disconnect: jest.fn()
    }
  }

  //--> assign mock directly without jest.fn
  window.IntersectionObserver = mock as any
  it('should render the ActionsRow', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <ActionsRow actions={[]} />
          </tr>
        </tbody>
      </table>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should handle an action row', () => {
    const spyRouter = jest.spyOn(Router, 'push')
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <ActionsRow
              actions={[
                {
                  title: 'action1',
                  icon: 'icon',
                  url: 'https://www.google.com.br/'
                }
              ]}
            />
          </tr>
        </tbody>
      </table>
    )

    const action = screen.getByText('icon')
    fireEvent.click(action)
    expect(spyRouter).toHaveBeenCalled()
  })

  it('should handle a delete action', async () => {
    let number = 5
    render(
      <table>
        <tbody>
          <tr>
            <ActionsRow
              actions={[
                {
                  title: 'Delete',
                  icon: 'icon',
                  handler: async () => {
                    number++
                  }
                }
              ]}
            />
          </tr>
        </tbody>
      </table>
    )

    const action = screen.getByText('icon')
    fireEvent.click(action)

    const modalButton = screen.getByText('Delete')
    fireEvent.click(modalButton)
    await waitFor(() => expect(number).toBe(6))
  })
})
