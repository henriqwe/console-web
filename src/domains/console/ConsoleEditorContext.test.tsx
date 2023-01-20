import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  renderHook
} from '@testing-library/react'
import { ViewConsole } from '.'
import React, { useEffect, useState } from 'react'
import {
  ConsoleEditorProvider,
  useConsoleEditor
} from 'domains/console/ConsoleEditorContext'
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

  it('should test handleFormat function', async () => {
    let Component = () => {
      const { handleFormat, consoleValue, handleChange, setFormatter } =
        useConsoleEditor()

      useEffect(() => {
        handleChange('val')
        setFormatter(() => 'val')
        handleFormat()
      }, [])

      return <div>{consoleValue}</div>
    }

    const { rerender } = render(
      <ConsoleEditorProvider>
        <Component />
      </ConsoleEditorProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('val')).toBeInTheDocument()
    })

    let Component1 = () => {
      const { handleFormat, consoleValue, handleChange, setFormatter } =
        useConsoleEditor()

      useEffect(() => {
        handleChange('val')
        setFormatter(() => 'val')
        handleFormat()
      }, [])

      return <div>{consoleValue}</div>
    }

    rerender(
      <ConsoleEditorProvider>
        <Component1 />
      </ConsoleEditorProvider>
    )
    await waitFor(() => {
      expect(screen.getByText('va')).toBeInTheDocument()
    })

    let Component2 = () => {
      const { handleFormat, consoleValue, handleChange, setFormatter } =
        useConsoleEditor()

      useEffect(() => {
        handleChange('val')
        setFormatter(() => {
          throw new Error('it broke')
        })
        handleFormat()
      }, [])

      return <div>{consoleValue}</div>
    }

    rerender(
      <ConsoleEditorProvider>
        <Component2 />
      </ConsoleEditorProvider>
    )
    await waitFor(() => {
      expect(toastCalls.includes('There was an error formatting')).toBe(true)
    })
  })

  it('should test loadParser function', async () => {
    jest.spyOn(utils.localApi, 'get').mockImplementation(async (url) => {
      if (url === '/parser?parserName=schema1') {
        return {
          data: { data: 'document' }
        }
      }
    })

    let Component = () => {
      const { documentationValue } = useConsoleEditor()

      return <div>{documentationValue}</div>
    }

    render(
      <ConsoleEditorProvider>
        <Component />
      </ConsoleEditorProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('document')).toBeInTheDocument()
    })

    jest.spyOn(utils.localApi, 'get').mockImplementation(async (url) => {
      throw { response: { status: 500, message: 'It broke' } }
    })
    let Component1 = () => {
      const { documentationValue } = useConsoleEditor()

      return <div>{documentationValue}</div>
    }

    render(
      <ConsoleEditorProvider>
        <Component1 />
      </ConsoleEditorProvider>
    )

    await waitFor(() => {
      expect(toastCalls.includes('It broke')).toBe(true)
    })
  })

  it('should test handleFormatQueryOrMutationEntityAndAttribute function', async () => {
    let Component = () => {
      const [val, setVal] = useState('')
      const { handleFormatQueryOrMutationEntityAndAttribute, consoleValue } =
        useConsoleEditor()

      useEffect(() => {
        handleFormatQueryOrMutationEntityAndAttribute({
          attribute: 'name',
          attributeType: 'String',
          entity: 'books'
        })
      }, [])

      useEffect(() => {
        if (consoleValue !== '') {
          setVal(JSON.parse(consoleValue ?? "{ action: 'Read' }").action)
        }
      }, [consoleValue])

      return <div>{val}</div>
    }

    const { rerender } = render(
      <ConsoleEditorProvider>
        <Component />
      </ConsoleEditorProvider>
    )

    let Component1 = () => {
      const [val, setVal] = useState('')
      const {
        handleFormatQueryOrMutationEntityAndAttribute,
        consoleValue,
        setConsoleValue
      } = useConsoleEditor()

      useEffect(() => {
        setConsoleValue(`{
          action: 'CREATE',
          data: [{ [entity]: { [attribute]: attributeTypeValue } }]
        }`)
        handleFormatQueryOrMutationEntityAndAttribute({
          attribute: 'name',
          attributeType: 'Text',
          entity: 'books'
        })
      }, [])

      useEffect(() => {
        if (consoleValue !== '') {
          setVal(JSON.parse(consoleValue ?? "{ action: 'Read' }").action)
        }
      }, [consoleValue])

      return <div>{val}</div>
    }

    rerender(
      <ConsoleEditorProvider>
        <Component1 />
      </ConsoleEditorProvider>
    )

    let Component2 = () => {
      const [render, setRender] = useState(false)
      const {
        handleFormatQueryOrMutationEntityAndAttribute,
        consoleValue,
        setConsoleValue
      } = useConsoleEditor()

      useEffect(() => {
        setConsoleValue(`{
          action: 'CREATE',
          data: [{ [entity]: { [attribute]: attributeTypeValue } }]
        }`)
      }, [])

      useEffect(() => {
        if (!render) {
          handleFormatQueryOrMutationEntityAndAttribute({
            attribute: 'names',
            attributeType: 'Text',
            entity: 'books'
          })
          setRender(true)
        }
      }, [consoleValue])

      return <div></div>
    }

    rerender(
      <ConsoleEditorProvider>
        <Component2 />
      </ConsoleEditorProvider>
    )
  })

  it('should test handleFormatQueryOrMutationEntity function', async () => {
    let Component = () => {
      const [render, setRender] = useState(false)
      const {
        handleFormatQueryOrMutationEntity,
        consoleValue,
        setConsoleValue
      } = useConsoleEditor()

      useEffect(() => {
        setConsoleValue(`{
            action: 'CREATE',
            data: [{ [entity]: { [attribute]: attributeTypeValue } }]
          }`)
      }, [])

      useEffect(() => {
        if (!render && consoleValue !== '') {
          console.log('consoleValue', consoleValue)
          handleFormatQueryOrMutationEntity({
            entity: 'books'
          })
          setRender(true)
        }
      }, [consoleValue])

      return <div>{consoleValue}</div>
    }

    const { rerender } = render(
      <ConsoleEditorProvider>
        <Component />
      </ConsoleEditorProvider>
    )
  })
})
