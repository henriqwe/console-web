import { renderHook, render } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { ExpiryCreditCardInput } from '.'
import '@testing-library/jest-dom'

describe('ExpiryCreditCardInput', () => {
  it('should render ExpiryCreditCardInput component', () => {
    const { result } = renderHook(() => useForm())
    const { container } = render(
      <ExpiryCreditCardInput control={result.current.control} />
    )
    expect(container.firstChild).toBeInTheDocument()
  })
})
