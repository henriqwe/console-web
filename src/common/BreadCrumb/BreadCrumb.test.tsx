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
            name: 'home'
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
            name: 'home'
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
            name: 'home'
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
            name: 'home'
          },
          {
            current: true,
            name: 'dashboard'
          }
        ]}
        showNumber
      />
    )

    const pageNumber = screen.getByText(1)

    expect(pageNumber).toBeInTheDocument()
  })
})

// pages: { name: string; current: boolean }[]
// showNumber?: boolean
