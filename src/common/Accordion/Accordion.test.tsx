import { render, screen } from '@testing-library/react'
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

    expect('Accordion!').toBeInTheDocument()
  })
})
