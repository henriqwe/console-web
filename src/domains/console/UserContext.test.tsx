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
import { UserProvider, useUser } from 'domains/console/UserContext'
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

  it('should render User Provider component', async () => {
    let Component = () => {
      const { currentTab } = useUser()

      return <div>{currentTab}</div>
    }

    render(
      <UserProvider>
        <Component />
      </UserProvider>
    )

    expect(screen.getByText('ACCOUNT')).toBeInTheDocument()
  })
})
