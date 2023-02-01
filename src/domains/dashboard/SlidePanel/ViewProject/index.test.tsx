import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ViewSchema } from '.'
import '@testing-library/jest-dom'

window.prompt = jest.fn()

let itShouldBreak = false
jest.mock('utils/api', () => ({
  api: {
    delete: (url: string, config: any) => {
      if (itShouldBreak) {
        throw { response: { data: { message: 'It broke' } } }
      }
      return
    }
  }
}))

let pushedRoutes: string[] = []
jest.mock('next/router', () => ({
  useRouter: () => {
    return {
      asPath: '/',
      push: (val: string) => {
        pushedRoutes.push(val)
      }
    }
  }
}))

let toastCalls: string[] = []
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn().mockImplementation((...args) => {
      toastCalls.push(args[0])
    }),
    error: jest.fn().mockImplementation((...args) => {
      toastCalls.push(args[0])
    })
  }
}))

jest.mock('utils/cookies', () => {
  return {
    getCookie: () => '123'
  }
})

jest.mock('domains/dashboard/DashboardContext', () => ({
  ...jest.requireActual('domains/dashboard/DashboardContext'),
  useData: () => ({
    setReload: () => null,
    reload: null,
    setSelectedSchema: () => null,
    selectedSchema: { name: 'projeto', tenantAc: '123', tenantId: '321' },
    setOpenSlide: () => null
  })
}))

Object.assign(navigator, {
  clipboard: {
    writeText: () => {}
  }
})

const mock = function () {
  return {
    observe: jest.fn(),
    disconnect: jest.fn()
  }
}

//--> assign mock directly without jest.fn
window.IntersectionObserver = mock as any

describe('ViewSchema', () => {
  const originalClipboard = { ...global.navigator.clipboard }

  beforeEach(() => {
    const mockClipboard = {
      writeText: jest.fn()
    }
    global.navigator.clipboard = mockClipboard
  })

  afterEach(() => {
    global.navigator.clipboard = originalClipboard
  })

  afterEach(() => {
    pushedRoutes = []
    toastCalls = []
  })
  it('should render ViewSchema component', async () => {
    const { container } = render(<ViewSchema />)

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should handle the delete schema action', async () => {
    render(<ViewSchema />)

    const deleteSchemaButton = screen.getByText('Delete schema')

    fireEvent.click(deleteSchemaButton)

    const deleteProjectModalButton = screen.getByText('Delete project')

    fireEvent.click(deleteProjectModalButton)

    await waitFor(() => {
      expect(toastCalls.includes('Project projeto deleted successfully')).toBe(
        true
      )
    })
  })

  it('should break the delete schema action', async () => {
    itShouldBreak = true
    render(<ViewSchema />)

    const deleteSchemaButton = screen.getByText('Delete schema')

    fireEvent.click(deleteSchemaButton)

    const deleteProjectModalButton = screen.getByText('Delete project')

    fireEvent.click(deleteProjectModalButton)

    await waitFor(() => {
      expect(toastCalls.includes('It broke')).toBe(true)
    })
  })

  it('should handle the submit action', async () => {
    render(<ViewSchema />)

    const deleteSchemaButton = screen.getByText('Delete schema')

    fireEvent.click(deleteSchemaButton)

    const deleteProjectModalButton = screen.getByText('Delete project')

    fireEvent.click(deleteProjectModalButton)

    await waitFor(() => {
      expect(toastCalls.includes('It broke')).toBe(true)
    })
  })

  it('should copy the schema tenantAc and tenantId to clipboard', async () => {
    render(<ViewSchema />)

    const tenantAcButton = screen.getByTestId('tenantAc')

    fireEvent.click(tenantAcButton)

    expect(navigator.clipboard.writeText).toBeCalledWith('123')

    const tenantIdButton = screen.getByTestId('tenantId')

    fireEvent.click(tenantIdButton)

    expect(navigator.clipboard.writeText).toBeCalledWith('321')
    expect(toastCalls.includes('Copied to clipboard')).toBe(true)
  })
})
