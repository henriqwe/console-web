import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Create } from '.'
import '@testing-library/jest-dom'

window.prompt = jest.fn()

let itShouldBreak = false
let itShouldBreakSchemaRoute = false
let itShouldBreakCreateAdminAccountRoute = false
jest.mock('utils/api', () => ({
  api: {
    get: async (url: string, config: any) => {
      if (itShouldBreakSchemaRoute) {
        throw new Error('it broke schema route')
      }

      if (itShouldBreak) {
        throw new Error('it broke')
      }

      if (url === 'v0/modeling/project-name/createdBrokedProject') {
        throw new Error('it broke getting project route')
      }
      if (url === 'v0/modeling/project-name/createdProject') {
        return {
          data: {
            name: 'schema',
            createdat: 0,
            status: 'string',
            tenantAc: 'string',
            tenantId: 'string'
          }
        }
      }
      return {
        data: [
          {
            name: 'schema',
            createdat: 0,
            status: 'string',
            tenantAc: 'string',
            tenantId: 'string'
          }
        ]
      }
    },
    post: async (url: string, config: any) => {
      if (
        (url ===
          'v0/modeling/project-name/createdProject/schema/create-admin-account' &&
          itShouldBreakCreateAdminAccountRoute) ||
        itShouldBreak ||
        (url === 'v0/modeling/project-name' && itShouldBreakSchemaRoute)
      ) {
        throw new Error('it broke')
      }
      return {
        data: [
          {
            name: 'schema',
            createdat: 0,
            status: 'string',
            tenantAc: 'string',
            tenantId: 'string'
          }
        ]
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

jest.mock('axios', () => {
  return {
    get: () => {
      if (itShouldBreak) {
        throw new Error('It broke')
      }
      return {
        data: {
          id: '123'
        }
      }
    }
  }
})

let cookiesSetted: string[] = []
jest.mock('utils/cookies', () => {
  return {
    getCookie: () => '123',
    setCookie: (name: string, val: string) => cookiesSetted.push(val)
  }
})

jest.mock('domains/dashboard/DashboardContext', () => ({
  ...jest.requireActual('domains/dashboard/DashboardContext'),
  useData: () => ({
    setCreatedSchemaName: () => null,
    setOpenSlide: () => null,
    setAdminUser: () => null,
    setSlideSize: () => null,
    setSlideType: () => null,
    setReload: () => null,
    reload: null
  })
}))

jest.mock('utils/transpiler', () => ({
  ycl_transpiler: {
    parse: (schema: string, bool: boolean) => {
      return {
        schema: {
          name: schema,
          entities: [
            {
              name: 'entity1',
              attributes: [
                {
                  _conf: {
                    type: {
                      value: 'conf.type.value'
                    }
                  }
                }
              ],
              associations: []
            }
          ]
        }
      }
    },
    deploy: (schema: { name: string }, callback: () => Promise<void>) => {
      callback()
    }
  }
}))

const mock = function () {
  return {
    observe: jest.fn(),
    disconnect: jest.fn()
  }
}

//--> assign mock directly without jest.fn
window.IntersectionObserver = mock as any

describe('CreateProject', () => {
  afterEach(() => {
    toastCalls = []
    cookiesSetted = []
    itShouldBreak = false
    itShouldBreakSchemaRoute = false
    itShouldBreakCreateAdminAccountRoute = false
  })
  it('should render CreateProject component', async () => {
    const { container } = render(<Create />)

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should create a project', async () => {
    render(<Create />)

    const projectNameInput = screen.getByPlaceholderText('Name')

    fireEvent.change(projectNameInput, { target: { value: 'createdProject' } })

    const createButton = screen.getByText('Create project')

    fireEvent.click(createButton)

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    })

    await waitFor(() => {
      expect(
        toastCalls.includes('Project createdProject created successfully')
      ).toBe(true)
      expect(cookiesSetted.includes('string')).toBe(true)
    })
  })

  it('should break the schema query', async () => {
    itShouldBreakSchemaRoute = true
    render(<Create />)

    const projectNameInput = screen.getByPlaceholderText('Name')

    fireEvent.change(projectNameInput, { target: { value: 'createdProject' } })

    const createButton = screen.getByText('Create project')

    fireEvent.click(createButton)

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    })

    await waitFor(() => {
      expect(toastCalls.includes('it broke schema route')).toBe(true)
    })
  })

  it("should break the submit action because there's a project with the same name", async () => {
    render(<Create />)

    const projectNameInput = screen.getByPlaceholderText('Name')

    fireEvent.change(projectNameInput, { target: { value: 'schema' } })

    const createButton = screen.getByText('Create project')

    fireEvent.click(createButton)

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    })

    await waitFor(() => {
      expect(toastCalls.includes('Project schema already exists')).toBe(true)
    })
  })

  it('should break the create admin query', async () => {
    itShouldBreakCreateAdminAccountRoute = true
    render(<Create />)

    const projectNameInput = screen.getByPlaceholderText('Name')

    fireEvent.change(projectNameInput, { target: { value: 'createdProject' } })

    const createButton = screen.getByText('Create project')

    fireEvent.click(createButton)

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    })

    await waitFor(() => {
      expect(toastCalls.includes('it broke')).toBe(true)
    })
  })

  it('should break the schemas query', async () => {
    itShouldBreakCreateAdminAccountRoute = true
    render(<Create />)

    const projectNameInput = screen.getByPlaceholderText('Name')

    fireEvent.change(projectNameInput, {
      target: { value: 'createdBrokedProject' }
    })

    const createButton = screen.getByText('Create project')

    fireEvent.click(createButton)

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    })

    await waitFor(() => {
      expect(toastCalls.includes('it broke getting project route')).toBe(true)
    })
  })

  it('should upload a wrong type of file', () => {
    render(<Create />)

    const uploadInput = screen.getByTestId('schemafile')

    const testImageFile = new File(['hello'], 'hello.png', {
      type: 'image/png'
    })
    userEvent.upload(uploadInput, testImageFile)

    expect(toastCalls.includes('Unsupported file type')).toBe(true)
  })

  it('should change layout on upload a file', async () => {
    render(<Create />)

    const projectNameInput = screen.getByPlaceholderText('Name')

    expect(projectNameInput).toBeInTheDocument()

    const uploadInput = screen.getByTestId('schemafile')

    const testFile = new File(['hello'], 'hello.yc')

    userEvent.upload(uploadInput, testFile)

    await waitFor(() => {
      expect(projectNameInput).not.toBeInTheDocument()

      const editor = screen.getByTestId('editor')
      const cancelButton = screen.getByText('Cancel')

      expect(uploadInput.parentElement?.parentElement).toHaveClass(
        'justify-between'
      )
      expect(editor).toBeInTheDocument()
      expect(cancelButton).toBeInTheDocument()
      fireEvent.click(cancelButton)
    })
  })

  it('should create project by an upload a file', async () => {
    render(<Create />)

    const projectNameInput = screen.getByPlaceholderText('Name')

    fireEvent.change(projectNameInput, {
      target: { value: 'testeeeeeeeeeeeeeeeeeeeeee' }
    })

    const uploadInput = screen.getByTestId('schemafile')

    const testFile = new File(['hello'], 'hello.yc')

    userEvent.upload(uploadInput, testFile)

    await waitFor(() => {
      expect(projectNameInput).not.toBeInTheDocument()
      const createButton = screen.getByText('Create project')
      fireEvent.click(createButton)
    })

    await waitFor(() => {
      expect(toastCalls.includes('Project hello created successfully')).toBe(
        true
      )
    })
  })

  it('should not create project by an upload a file because schema name is less than 3 characters', async () => {
    render(<Create />)

    const projectNameInput = screen.getByPlaceholderText('Name')

    fireEvent.change(projectNameInput, {
      target: { value: 'testeeeeeeeeeeeeeeeeeeeeee' }
    })

    const uploadInput = screen.getByTestId('schemafile')

    const testFile = new File(['te'], 'hello.yc')

    userEvent.upload(uploadInput, testFile)

    await waitFor(() => {
      expect(projectNameInput).not.toBeInTheDocument()
      const createButton = screen.getByText('Create project')
      fireEvent.click(createButton)
    })

    await waitFor(() => {
      expect(
        toastCalls.includes('Project name must be at least 3 characters long')
      ).toBe(true)
    })
  })

  it('should not create project by an upload a file because its using an existing project name', async () => {
    render(<Create />)

    const projectNameInput = screen.getByPlaceholderText('Name')

    fireEvent.change(projectNameInput, {
      target: { value: 'testeeeeeeeeeeeeeeeeeeeeee' }
    })

    const uploadInput = screen.getByTestId('schemafile')

    const testFile = new File(['schema'], 'hello.yc')

    userEvent.upload(uploadInput, testFile)

    await waitFor(() => {
      expect(projectNameInput).not.toBeInTheDocument()
      const createButton = screen.getByText('Create project')
      fireEvent.click(createButton)
    })

    await waitFor(() => {
      expect(
        toastCalls.includes('Schema schema already exists')
      ).toBe(true)
    })
  })
})
