import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import RelationEdge from './RelationEdge'
import * as utils from 'utils'
import '@testing-library/jest-dom'
import { Position, ReactFlowProvider } from 'reactflow'

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

class DOMMatrixReadOnly {
  m22: number
  constructor(transform: string) {
    const scale = transform?.match(/scale\(([1-9.])\)/)?.[1]
    this.m22 = scale !== undefined ? +scale : 1
  }
}
// @ts-ignore
global.DOMMatrixReadOnly = DOMMatrixReadOnly

Object.defineProperties(global.HTMLElement.prototype, {
  offsetHeight: {
    get() {
      return parseFloat(this.style.height) || 1
    }
  },
  offsetWidth: {
    get() {
      return parseFloat(this.style.width) || 1
    }
  }
})

;(global.SVGElement as any).prototype.getBBox = () => ({
  x: 0,
  y: 0,
  width: 0,
  height: 0
})

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

jest.mock('utils/api', () => ({
  api: {
    put: jest.fn()
  }
}))

let localToured = { section: '', val: false }
jest.mock('contexts/TourContext', () => ({
  useLocalTour: () => ({
    getToured: () => ({ dataapi: false }),
    setLocalToured: (section: string, val: boolean) => {
      localToured.section = section
      localToured.val = val
    }
  })
}))

let schemaStatus = 0
jest.mock('domains/console/SchemaManagerContext', () => ({
  useSchemaManager: () => ({
    schemaStatus,
    setSchemaStatus: (val: number) => {
      schemaStatus = val
    }
  })
}))

describe('RelationEdge', () => {
  afterEach(() => {
    toastCalls = []
  })

  it('should render RelationEdge component', () => {
    const { container } = render(
      <ReactFlowProvider>
        <RelationEdge
          sourceX={0}
          sourceY={0}
          targetX={0}
          targetY={0}
          sourcePosition={Position.Left}
          targetPosition={Position.Left}
          label={'label'}
          labelStyle={{}}
          labelShowBg={false}
          labelBgBorderRadius={0}
          labelBgPadding={[0, 0]}
          labelBgStyle={{}}
          data={{ relationType: '1-1' }}
          id={''}
          source={''}
          target={''}
        />
      </ReactFlowProvider>
    )

    expect(container.firstChild).toBeInTheDocument()
  })
})
