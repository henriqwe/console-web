import { render, screen, fireEvent } from '@testing-library/react'
import { CreditCard } from '.'
import * as utils from 'utils'
import '@testing-library/jest-dom'

describe('CreditCard', () => {
  it('should render the CreditCard without brand image', () => {
    const cardNumber = '5591974144588035'
    const cardCVV = '123'
    const cardExpiration = '12/30'
    const cardName = 'Test Card'

    render(
      <CreditCard
        number={cardNumber}
        cvv={cardCVV}
        expiry={cardExpiration}
        name={cardName}
      />
    )

    const renderedCardName = screen.getByText(cardName.toUpperCase())
    expect(renderedCardName).toBeInTheDocument()

    const renderedCardExpiration = screen.getByText(cardExpiration)
    expect(renderedCardExpiration).toBeInTheDocument()

    const renderedCardNumber = screen.getByText(
      utils.formatCardNumber(cardNumber)
    )
    expect(renderedCardNumber).toBeInTheDocument()

    const renderedCardCVV = screen.getByText(cardCVV)
    expect(renderedCardCVV).toBeInTheDocument()
  })

  it('should render the CreditCard with brand image', () => {
    const cardNumber = '5591974144588035'
    const cardCVV = '123'
    const cardExpiration = '12/30'
    const cardName = 'Test Card'

    render(
      <CreditCard
        number={cardNumber}
        cvv={cardCVV}
        expiry={cardExpiration}
        name={cardName}
        brand="mastercard"
      />
    )

    const renderedCardName = screen.getByText(cardName.toUpperCase())
    expect(renderedCardName).toBeInTheDocument()

    const renderedCardExpiration = screen.getByText(cardExpiration)
    expect(renderedCardExpiration).toBeInTheDocument()

    const renderedCardNumber = screen.getByText(
      utils.formatCardNumber(cardNumber)
    )
    expect(renderedCardNumber).toBeInTheDocument()

    const renderedCardCVV = screen.getByText(cardCVV)
    expect(renderedCardCVV).toBeInTheDocument()

    const renderedCardBrand = screen.getByAltText('credit card brand')
    expect(renderedCardBrand).toBeInTheDocument()
  })
})
