import { render, screen, fireEvent } from '@testing-library/react'
import { AccordionGroup } from './'
import '@testing-library/jest-dom'

describe('Accordion Group', () => {
  it('should render the accordion', () => {
    render(<AccordionGroup accordionsData={[]} />)

    const title = screen.queryByText('Accordion!')

    expect(title).not.toBeInTheDocument()
  })

  it('should render the accordion content', () => {
    render(
      <AccordionGroup
        accordionsData={[
          {
            id: 123,
            title: 'Accordion 1',
            content: (
              <div>
                <p>test</p>
              </div>
            ),
            action: () => null,
            defaultOpen: true
          }
        ]}
      />
    )

    const title = screen.queryByText('Accordion 1')

    expect(title).toBeInTheDocument()
  })

  it('should hide the primary accordion content after click on second one', () => {
    render(
      <AccordionGroup
        accordionsData={[
          {
            id: 123,
            title: 'Accordion 1',
            content: (
              <div data-testid="test1">
                <p>test 1</p>
              </div>
            ),
            action: () => {},
            defaultOpen: false
          },
          {
            id: 124,
            title: 'Accordion 2',
            content: (
              <div data-testid="test2">
                <p>test 2</p>
              </div>
            ),
            action: () => {},
            defaultOpen: false
          }
        ]}
        hideSelf
      />
    )

    const firstTitle = screen.getByTitle('Accordion 1')
    fireEvent.click(firstTitle)

    let firstAcordionContent = screen.queryByTestId('test1')
    let secondAcordionContent = screen.queryByTestId('test2')

    expect(firstAcordionContent).toBeInTheDocument()
    expect(secondAcordionContent).not.toBeInTheDocument()

    const secondTitle = screen.getByTitle('Accordion 2')
    fireEvent.click(secondTitle)

    firstAcordionContent = screen.queryByTestId('test1')
    secondAcordionContent = screen.queryByTestId('test2')

    expect(firstAcordionContent).not.toBeInTheDocument()
    expect(secondAcordionContent).toBeInTheDocument()
  })

  it('should render both accordion content after click on second one', () => {
    render(
      <AccordionGroup
        accordionsData={[
          {
            id: 123,
            title: 'Accordion 1',
            content: (
              <div data-testid="test1">
                <p>test 1</p>
              </div>
            ),
            action: () => {},
            defaultOpen: false
          },
          {
            id: 124,
            title: 'Accordion 2',
            content: (
              <div data-testid="test2">
                <p>test 2</p>
              </div>
            ),
            action: () => {},
            defaultOpen: false
          }
        ]}
      />
    )

    const firstTitle = screen.getByTitle('Accordion 1')
    fireEvent.click(firstTitle)

    let firstAcordionContent = screen.queryByTestId('test1')
    let secondAcordionContent = screen.queryByTestId('test2')

    expect(firstAcordionContent).toBeInTheDocument()
    expect(secondAcordionContent).not.toBeInTheDocument()

    const secondTitle = screen.getByTitle('Accordion 2')
    fireEvent.click(secondTitle)

    firstAcordionContent = screen.queryByTestId('test1')
    secondAcordionContent = screen.queryByTestId('test2')

    expect(firstAcordionContent).not.toBeInTheDocument()
    expect(secondAcordionContent).toBeInTheDocument()
  })
})
