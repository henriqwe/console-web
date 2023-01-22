import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { PixelProvider, usePixel } from './PixelContext'
import React, { useEffect } from 'react'

jest.mock('react-facebook-pixel', () => ({
  init: () => null,
  value: '123'
}))

describe('Pixel context', () => {
  it('should render a component using pixel provider', async () => {
    const Component = () => {
      const { pixel } = usePixel()

      return <div>{pixel?.value}</div>
    }
    render(
      <PixelProvider>
        <Component />
      </PixelProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(`123`)).toBeInTheDocument()
    })
  })
})
