import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  renderHook
} from '@testing-library/react'
import { ViewConsole } from '.'
import React, { ReactNode, useEffect, useState } from 'react'
import {
  SchemaManagerProvider,
  useSchemaManager
} from 'domains/console/SchemaManagerContext'
import * as utils from 'utils'
import '@testing-library/jest-dom'

class ResizeObserver {
  callback: globalThis.ResizeObserverCallback

  constructor(callback: globalThis.ResizeObserverCallback) {
    this.callback = callback
  }

  observe(target: Element) {
    this.callback([{ target } as globalThis.ResizeObserverEntry], this)
  }

  unobserve() {}

  disconnect() {}
}

global.ResizeObserver = ResizeObserver

jest.mock('utils/api', () => ({
  api: {
    put: jest.fn(),
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn()
  },
  localApi: {
    post: jest.fn(),
    get: jest.fn()
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

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: (val: string) => {
      mockPush(val)
    },
    query: { name: 'schema1' }
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

describe('ViewConsole', () => {
  afterEach(() => {
    toastCalls = []
  })

  it('should render Schema manager', async () => {
    let Component = () => {
      const { currentTabSchema } = useSchemaManager()

      return <div>{currentTabSchema}</div>
    }

    render(
      <SchemaManagerProvider>
        <Component />
      </SchemaManagerProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Modeler')).toBeInTheDocument()
    })
  })

  it('should test goToEntitiesPage function', async () => {
    let Component = () => {
      const { currentTabSchema, goToEntitiesPage } = useSchemaManager()

      useEffect(() => {
        goToEntitiesPage()
      }, [])
      return <div>{currentTabSchema}</div>
    }

    render(
      <SchemaManagerProvider>
        <Component />
      </SchemaManagerProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Databases')).toBeInTheDocument()
    })
  })

  it('should test goToModelerPage function', async () => {
    let Component = () => {
      const { currentTabSchema, goToModelerPage } = useSchemaManager()

      useEffect(() => {
        goToModelerPage()
      }, [])
      return <div>{currentTabSchema}</div>
    }

    render(
      <SchemaManagerProvider>
        <Component />
      </SchemaManagerProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Modeler')).toBeInTheDocument()
    })
  })

  it('should test goToUserAndRolesPage function', async () => {
    let Component = () => {
      const { currentTabSchema, goToUserAndRolesPage } = useSchemaManager()

      useEffect(() => {
        goToUserAndRolesPage()
      }, [])
      return <div>{currentTabSchema}</div>
    }

    render(
      <SchemaManagerProvider>
        <Component />
      </SchemaManagerProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Users and Roles')).toBeInTheDocument()
    })
  })

  it('should test view entity function', async () => {
    let Component = () => {
      const { breadcrumbPagesData } = useSchemaManager()

      return (
        <div>
          {breadcrumbPagesData.viewEntity('books').map((item) => (
            <p key={item.content}>{item.content}</p>
          ))}
        </div>
      )
    }

    render(
      <SchemaManagerProvider>
        <Component />
      </SchemaManagerProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Schema')).toBeInTheDocument()
      expect(screen.getByText('Database')).toBeInTheDocument()
      expect(screen.getByText('books')).toBeInTheDocument()
    })
  })

  it('should test viewEntityRelationship function', async () => {
    let Component = () => {
      const { breadcrumbPagesData } = useSchemaManager()

      return (
        <div>
          {breadcrumbPagesData.viewEntityRelationship('books').map((item) => (
            <p key={item.content}>{item.content}</p>
          ))}
        </div>
      )
    }

    render(
      <SchemaManagerProvider>
        <Component />
      </SchemaManagerProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Schema')).toBeInTheDocument()
      expect(screen.getByText('Database')).toBeInTheDocument()
      expect(screen.getByText('books')).toBeInTheDocument()
      expect(screen.getByText('Relationship')).toBeInTheDocument()
    })
  })

  it('should test loadEntities function', async () => {
    jest.spyOn(utils.api, 'get').mockImplementation(async (url) => {
      return { data: '123' }
    })

    let Component = () => {
      const { loadEntities, schemaTables } = useSchemaManager()

      useEffect(() => {
        loadEntities()
      }, [])

      return <div>{schemaTables as ReactNode}</div>
    }

    const { rerender } = render(
      <SchemaManagerProvider>
        <Component />
      </SchemaManagerProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('123')).toBeInTheDocument()
    })

    jest.spyOn(utils.api, 'get').mockImplementation(async () => {
      throw { response: { status: 500, message: 'it broke' } }
    })

    let Component1 = () => {
      const { loadEntities, schemaTables } = useSchemaManager()

      useEffect(() => {
        loadEntities()
      }, [])

      return <div>{schemaTables as ReactNode}</div>
    }

    rerender(
      <SchemaManagerProvider>
        <Component1 />
      </SchemaManagerProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('123')).toBeInTheDocument()
      expect(toastCalls.includes('it broke')).toBe(true)
    })
  })
})
