import { render, screen, fireEvent } from '@testing-library/react'
import { SlideWithTabs } from '.'
import '@testing-library/jest-dom'

describe('SlideWithTabs', () => {
  const mock = function () {
    return {
      observe: jest.fn(),
      disconnect: jest.fn()
    }
  }

  //--> assign mock directly without jest.fn
  window.IntersectionObserver = mock as any
  it('should render the SlideWithTabs', () => {
    const { container } = render(<SlideWithTabs tabsData={[]} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render all SlideWithTabs widths', () => {
    const { rerender } = render(
      <SlideWithTabs
        slideSize="fullPage"
        tabsData={[
          { title: 'test button 1', color: 'blue', content: 'test content 1' }
        ]}
      />
    )
    const testTitle = screen.getByText('test button 1')
    fireEvent.click(testTitle)
    const slider = screen.getByRole('slider')
    expect(slider).toHaveClass('max-w-[80%]')

    rerender(
      <SlideWithTabs
        slideSize="halfPage"
        tabsData={[
          { title: 'test button 1', color: 'blue', content: 'test content 1' }
        ]}
      />
    )

    expect(slider).toHaveClass('max-w-[50%]')
  })

  it('should open the SlideWithTabs when clicked on the button', () => {
    render(
      <SlideWithTabs
        tabsData={[
          { title: 'test button 1', color: 'blue', content: 'test content 1' }
        ]}
        slideSize="fullPage"
      />
    )
    const testTitle = screen.getByText('test button 1')
    fireEvent.click(testTitle)
    const content = screen.getByText('test content 1')
    expect(content).toBeInTheDocument()
  })

  it('should change the SlideWithTabs when clicked on the second tab button', () => {
    render(
      <SlideWithTabs
        tabsData={[
          { title: 'test button 1', color: 'blue', content: 'test content 1' },
          { title: 'test button 2', color: 'red', content: 'test content 2' }
        ]}
        slideSize="fullPage"
      />
    )
    const testTitle = screen.getByText('test button 1')
    fireEvent.click(testTitle)
    const content = screen.getByText('test content 1')
    expect(content).toBeInTheDocument()
    const secondTestTitle = screen.getByText('test button 2')
    fireEvent.click(secondTestTitle)
    expect(content.textContent).toBe('test content 2')
  })

  it('should close the SlideWithTabs when clicked on the close button', () => {
    const { container } = render(
      <SlideWithTabs
        tabsData={[
          { title: 'test button 1', color: 'blue', content: 'test content 1' }
        ]}
        slideSize="fullPage"
      />
    )
    const testTitle = screen.getByText('test button 1')
    fireEvent.click(testTitle)
    const content = screen.getByText('test content 1')
    expect(content).toBeInTheDocument()
    fireEvent.keyDown(container, {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27
    })
    const closeButton = screen.getByTitle('Close')
    fireEvent.click(closeButton)
    expect(content).not.toBeInTheDocument()
  })

  it('should render the SlideWithTabs without padding', () => {
    render(
      <SlideWithTabs
        tabsData={[
          { title: 'test button 1', color: 'blue', content: 'test content 1' },
          { title: 'test button 2', color: 'red', content: 'test content 2' }
        ]}
        noPadding
      />
    )
    const testTitle = screen.getByText('test button 1')
    fireEvent.click(testTitle)
    const content = screen.getByText('test content 1')
    expect(content).not.toHaveClass('px-4 sm:px-6')
  })
})
