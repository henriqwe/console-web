import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { RowActions } from './RowActions'
import * as utils from 'utils'
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

const setSlideType = jest.fn()
const setOpenSlide = jest.fn()
const setSelectedUser = jest.fn()
jest.mock('domains/console/UserContext', () => ({
  useUser: () => ({
    setSelectedUser,
    setSlideType,
    setOpenSlide
  })
}))

describe('RowActions', () => {
  it('should render RowActions component', () => {
    render(
      <table>
        <thead />
        <tbody>
          <tr>
            <RowActions item={{}} />
          </tr>
        </tbody>
      </table>
    )

    const updateIcon = screen.getByTestId('update')
    expect(updateIcon).toBeInTheDocument()
  })

  it('should open modal to create a new account', async () => {
    render(
      <table>
        <thead />
        <tbody>
          <tr>
            <RowActions item={{}} />
          </tr>
        </tbody>
      </table>
    )
    const updateIcon = screen.getByTestId('update')
    fireEvent.click(updateIcon)

    expect(setSlideType).toBeCalledWith('UPDATEACCOUNT')
    expect(setOpenSlide).toBeCalledWith(true)
    expect(setSelectedUser).toBeCalledWith({})
  })
})
