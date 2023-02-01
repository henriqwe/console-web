import { render } from '@testing-library/react'
import { SlidePanel } from '.'
import '@testing-library/jest-dom'


const mock = function () {
  return {
    observe: jest.fn(),
    disconnect: jest.fn()
  }
}

//--> assign mock directly without jest.fn
window.IntersectionObserver = mock as any

jest.mock('utils/api', () => ({
  api: {
    put: jest.fn(),
    post: jest.fn(),
    delete: jest.fn()
  }
}))

jest.mock('domains/console/SchemaManagerContext', () => ({
  useSchemaManager: () => ({
    setOpenSlide: () => null, 
    openSlide: true
  })
}))

describe('UpdateEntityName', () => {

  it('should render UpdateEntityName component', () => {
    const { container } = render(<SlidePanel />)

    expect(container.firstChild).toBeInTheDocument()
  })
})
