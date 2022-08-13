import { render, screen, fireEvent } from '@testing-library/react'
import { Slide } from '.'
import '@testing-library/jest-dom'

describe('Slide', () => {
  const mock = function () {
    return {
      observe: jest.fn(),
      disconnect: jest.fn()
    }
  }

  //--> assign mock directly without jest.fn
  window.IntersectionObserver = mock as any
  it('should render the Slide', () => {
    const { container } = render(
      <Slide open setOpen={jest.fn} title="" content={<div />} />
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should not render the Slide', () => {
    const { container } = render(
      <Slide open={false} setOpen={jest.fn} title="" content={<div />} />
    )
    expect(container.firstChild).not.toBeInTheDocument()
  })

  it('should render all Slide widths', () => {
    const { rerender } = render(
      <Slide
        open={true}
        setOpen={jest.fn}
        title=""
        content={<div />}
        slideSize="fullPage"
      />
    )
    const slide = screen.getByRole('slider')
    expect(slide).toHaveClass('max-w-[80%]')

    rerender(
      <Slide
        open={true}
        setOpen={jest.fn}
        title=""
        content={<div />}
        slideSize="halfPage"
      />
    )

    expect(slide).toHaveClass('max-w-[50%]')
  })

  it('should close the slide when clicked on the close button', () => {
    const { rerender, container } = render(
      <Slide
        open={true}
        setOpen={jest.fn}
        title="testTitle"
        content={<div />}
        slideSize="fullPage"
      />
    )
    const testTitle = screen.getByText('testTitle')
    fireEvent.keyDown(container, {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27
    })
    const closeButton = screen.getByTitle('Close')
    fireEvent.click(closeButton)

    rerender(
      <Slide
        open={false}
        setOpen={jest.fn}
        title=""
        content={<div />}
        slideSize="halfPage"
      />
    )
    expect(testTitle).not.toBeInTheDocument()
  })

  it('should render the Slide without padding', () => {
    render(
      <Slide
        open={true}
        setOpen={jest.fn}
        title=""
        noPadding
        content={'test'}
      />
    )
    const content = screen.getByText('test')
    expect(content).not.toHaveClass('px-4 sm:px-6')
  })
})
