import { render, screen } from '@testing-library/react'
import { Card } from '.'
import '@testing-library/jest-dom'

describe('Card', () => {
  it('should render the YellowOutline', () => {
    render(<Card className="bg-white">Card</Card>)

    const cardChildren = screen.getByText('Card')

    expect(cardChildren).toBeInTheDocument()
  })
})
