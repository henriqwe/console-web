import { render, screen, fireEvent } from '@testing-library/react'
import { AccordionGroup } from './'
import '@testing-library/jest-dom'

describe('Accordion Group', () => {
  it('should render the accordion', () => {
    render(<AccordionGroup accordionsData={[]} />)

    const title = screen.queryByText('Accordion!')

    expect(title).not.toBeInTheDocument()
  })

  it('should render the accordion', () => {
    render(<AccordionGroup accordionsData={[]} />)

    const title = screen.queryByText('Accordion!')

    expect(title).not.toBeInTheDocument()
  })
})
