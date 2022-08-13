import { render } from '@testing-library/react'
import { DownloadIcon } from '.'
import '@testing-library/jest-dom'

describe('DownloadIcon', () => {
  it('should render the DownloadIcon', () => {
    const { container } = render(<DownloadIcon data-testid="test1" />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
