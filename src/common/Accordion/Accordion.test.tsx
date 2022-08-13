import { render, screen, fireEvent } from '@testing-library/react'
import { Accordion } from './'
import '@testing-library/jest-dom'
import { createRef } from 'react'

describe('Accordion', () => {
  it('should render the accordion', () => {
    render(
      <Accordion
        title="Accordion!"
        content={<div />}
        elementRef={createRef()}
      />
    )

    const title = screen.getByText('Accordion!')

    expect(title).toBeInTheDocument()
  })

  it('should render the accordion content', () => {
    render(
      <Accordion
        title="Accordion!"
        content={
          <div>
            <p>Accordion content</p>
          </div>
        }
        elementRef={createRef()}
        defaultOpen={true}
      />
    )

    const content = screen.getByText('Accordion content')

    expect(content).toBeInTheDocument()
  })

  it('should not render the accordion content', () => {
    render(
      <Accordion
        title="Accordion!"
        content={
          <div>
            <p>Accordion content</p>
          </div>
        }
        elementRef={createRef()}
      />
    )

    const content = screen.queryByText('Accordion content')

    expect(content).not.toBeInTheDocument()
  })

  it('should execute the correct action', () => {
    const mock = jest.fn(() => null)
    render(
      <Accordion
        title="Accordion!"
        action={mock}
        content={
          <div>
            <p>Accordion content</p>
          </div>
        }
        elementRef={createRef()}
      />
    )

    const button = screen.getByTitle('Accordion!')
    fireEvent.click(button)

    expect(mock).toBeCalled()
  })
})
