import { render, screen, fireEvent } from '@testing-library/react'
import { TourStep } from '.'
import * as utils from 'utils'
import '@testing-library/jest-dom'

describe('TourStep', () => {
  it('should render the TourStep', () => {
    render(
      <TourStep
        title="Test step"
        content="This is a test step, it should be rendered"
      />
    )

    const renderedTitle = screen.getByText('Test step')
    expect(renderedTitle).toBeInTheDocument()

    const renderedContent = screen.getByText(
      'This is a test step, it should be rendered'
    )
    expect(renderedContent).toBeInTheDocument()
  })
})
