import { render, screen } from '@testing-library/react'
import { SlidePanel } from '.'
import '@testing-library/jest-dom'

window.prompt = jest.fn()

let slideType = 'createProject'
jest.mock('domains/dashboard/DashboardContext', () => ({
  ...jest.requireActual('domains/dashboard/DashboardContext'),
  useData: () => ({
    setOpenSlide: () => null,
    openSlide: true,
    slideType,
    selectedSchema: { name: 'schema' },
    slideSize: 'normal'
  })
}))

const mock = function () {
  return {
    observe: jest.fn(),
    disconnect: jest.fn()
  }
}

//--> assign mock directly without jest.fn
window.IntersectionObserver = mock as any

describe('Projects', () => {
  it('should render Projects component', async () => {
    slideType = 'createProject'
    const { container } = render(<SlidePanel />)

    expect(container.firstChild).toBeInTheDocument()
    expect(screen.getByText('New Project')).toBeInTheDocument()
  })

  it('should render Projects component with view admin content', async () => {
    slideType = 'ViewAdminUser'
    const { container } = render(<SlidePanel />)

    expect(container.firstChild).toBeInTheDocument()
    expect(screen.getByText('Admin Data')).toBeInTheDocument()
  })

  it('should render Projects component with view project', async () => {
    slideType = 'viewProject'
    const { container } = render(<SlidePanel />)

    expect(container.firstChild).toBeInTheDocument()
    expect(screen.getByText('schema')).toBeInTheDocument()
  })

  it('should render Projects component', async () => {
    slideType = 'createTicket'
    const { container } = render(<SlidePanel />)

    expect(container.firstChild).toBeInTheDocument()
    expect(screen.getByText('New ticket')).toBeInTheDocument()
  })
})
