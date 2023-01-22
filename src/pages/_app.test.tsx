import '@testing-library/jest-dom'
import { act, render, screen, waitFor } from '@testing-library/react'
import WrapperApp from './_app'
import React, { ReactNode } from 'react'
import * as utils from 'utils'

let asPath = ''
jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath
  })
}))

let signIn = jest.fn()
let data: any | undefined = {
  user: {
    name: 'aleatorio'
  },
  accessToken: '123'
}
let status = 'unauthenticated'
jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  useSession: () => ({
    data,
    status
  }),
  signIn: jest.fn((val) => {
    signIn(val)
  })
}))

jest.mock('utils/api', () => ({
  api: {
    get: jest.fn()
  }
}))

jest.mock('contexts/PixelContext', () => ({
  PixelProvider: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  )
}))

jest.mock('nextjs-progressbar', () => {
  const NextNprogress = () => <div></div>
  return NextNprogress
})

jest.mock('contexts/UserContext', () => ({
  ...jest.requireActual('contexts/UserContext'),
  useUser: () => ({
    user: {},
    setUser: jest.fn()
  })
}))

describe('WrapperApp', () => {
  beforeEach(() => {
    asPath = ''
    signIn = jest.fn()
    data = {
      user: {
        name: 'aleatorio'
      },
      accessToken: '123'
    }
    status = 'unauthenticated'
  })

  it('should render a WrapperApp with loading status', async () => {
    render(
      <WrapperApp
        Component={() => <div />}
        pageProps={{ session: '' }}
        router={{
          asPath: ''
        }}
      />
    )

    expect(screen.getByText(`Carregando...`)).toBeInTheDocument()
  })

  it('should test getUserData function', async () => {
    let requestedUrl = ''
    jest.spyOn(utils.api, 'get').mockImplementation(async (url) => {
      requestedUrl = url
      return {
        data: {
          gatewayPaymentKey: '123'
        }
      }
    })

    render(
      <WrapperApp
        Component={() => <div />}
        pageProps={{ session: '' }}
        router={{
          asPath: ''
        }}
      />
    )

    expect(screen.getByText(`Carregando...`)).toBeInTheDocument()

    await waitFor(() => {
      expect(requestedUrl).toBe('v0/id/account/get')
      expect(signIn).toBeCalled()
    })
  })

  it('should break getUserData function', async () => {
    jest.spyOn(utils.api, 'get').mockImplementation(async (url) => {
      throw new Error('it broke')
    })

    const error = jest.spyOn(console, 'error').mockImplementation(() => {
      return
    })

    render(
      <WrapperApp
        Component={() => <div />}
        pageProps={{ session: '' }}
        router={{
          asPath: ''
        }}
      />
    )

    expect(screen.getByText(`Carregando...`)).toBeInTheDocument()

    await waitFor(() => {
      expect(error).toBeCalled()
    })
  })

  it('should run signIn function', async () => {
    jest.useFakeTimers()
    data = undefined
    status = ''
    jest.spyOn(utils.api, 'get').mockImplementation(async (url) => {
      return {
        data: {
          gatewayPaymentKey: '123'
        }
      }
    })

    render(
      <WrapperApp
        Component={() => <div />}
        pageProps={{ session: '' }}
        router={{
          asPath: ''
        }}
      />
    )

    expect(screen.getByText(`Carregando...`)).toBeInTheDocument()

    jest.runOnlyPendingTimers()
    await waitFor(() => {
      expect(signIn).toBeCalled()
    })
  })

  it('should render the real content', async () => {
    jest.useFakeTimers()
    status = 'authenticated'
    asPath = '/login'
    jest.spyOn(utils.api, 'get').mockImplementation(async (url) => {
      return {
        data: {
          gatewayPaymentKey: '123'
        }
      }
    })

    const { container, rerender } = render(
      <WrapperApp
        Component={() => <div>Content</div>}
        pageProps={{ session: '' }}
        router={{
          asPath: ''
        }}
      />
    )

    expect(screen.queryByText(`Carregando...`)).not.toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()

    asPath = '/register'
    rerender(
      <WrapperApp
        Component={() => <div>register</div>}
        pageProps={{ session: '' }}
        router={{
          asPath: ''
        }}
      />
    )

    expect(screen.getByText('register')).toBeInTheDocument()

    asPath = '/change-password'
    rerender(
      <WrapperApp
        Component={() => <div>change-password</div>}
        pageProps={{ session: '' }}
        router={{
          asPath: ''
        }}
      />
    )

    expect(screen.getByText('change-password')).toBeInTheDocument()

    asPath = '/'
    rerender(
      <WrapperApp
        Component={() => <div>Home</div>}
        pageProps={{ session: '' }}
        router={{
          asPath: ''
        }}
      />
    )

    expect(screen.getByText('Home')).toBeInTheDocument()
  })
})
