import { render, screen, fireEvent } from '@testing-library/react'
import { Breadcrumb } from './'
import '@testing-library/jest-dom'

describe('Breadcrumb', () => {
  it('should render the Breadcrumb', () => {
    render(<Breadcrumb pages={[]} />)

    const olList = screen.getByRole('list')

    expect(olList).toBeInTheDocument()
  })

  it('should render the current Breadcrumb page', () => {
    render(
      <Breadcrumb
        pages={[
          {
            current: true,
            content: 'home'
          }
        ]}
      />
    )

    const pageName = screen.getByText('home')

    expect(pageName).toBeInTheDocument()
  })

  it('should render a not current Breadcrumb page', () => {
    render(
      <Breadcrumb
        pages={[
          {
            current: false,
            content: 'home'
          }
        ]}
      />
    )

    const pageName = screen.getByText('home')

    expect(pageName).toBeInTheDocument()
  })

  it('should render a not current Breadcrumb page with numbers', () => {
    render(
      <Breadcrumb
        pages={[
          {
            current: false,
            content: 'home'
          }
        ]}
        showNumber
      />
    )

    const pageNumber = screen.getByText(1)

    expect(pageNumber).toBeInTheDocument()
  })

  it('should render a current Breadcrumb 2 page with numbers', () => {
    render(
      <Breadcrumb
        pages={[
          {
            current: true,
            content: 'home'
          },
          {
            current: true,
            content: 'dashboard'
          }
        ]}
        showNumber
      />
    )

    const pageNumber = screen.getByText(1)

    expect(pageNumber).toBeInTheDocument()
  })

  it('should handle the action inside the breadcrumb', () => {
    const action = jest.fn()
    render(
      <Breadcrumb
        pages={[
          {
            current: true,
            content: 'home',
            action
          },
          {
            current: true,
            content: 'dashboard'
          }
        ]}
        showNumber
      />
    )

    const olList = screen.getByRole('list')
    fireEvent.click(olList.firstChild as ChildNode)

    expect(action).toBeCalled()
  })
})

// pages: { content: string; current: boolean }[]
// showNumber?: boolean
