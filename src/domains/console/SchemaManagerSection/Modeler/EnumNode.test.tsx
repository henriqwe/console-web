import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import EnumNode from './EnumNode'
import '@testing-library/jest-dom'

jest.mock('reactflow', () => ({
  Position: { Bottom: '' },
  Handle: () => <div />
}))

describe('EnumNode', () => {
  it('should render EnumNode component', () => {
    const { container } = render(
      <EnumNode
        data={{ name: '', documentation: '', values: [''], dbName: '' }}
      />
    )

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should expand the EnumNode component', () => {
    const { container } = render(
      <EnumNode
        data={{
          name: '',
          documentation: '',
          values: [
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12'
          ]
        }}
      />
    )

    const button = screen.getByText('Expand')
    fireEvent.click(button)

    expect(screen.getByText('Fold')).toBeInTheDocument()
    expect(container.firstChild).toBeInTheDocument()
  })
})
