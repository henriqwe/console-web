import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Template } from './Template'
import '@testing-library/jest-dom'

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

let cookiesRemoved: string[] = []
jest.mock('utils', () => ({
  removeCookie: (val: string) => {
    cookiesRemoved.push(val)
  }
}))

jest.mock('next-auth/react', () => ({
  signOut: jest.fn()
}))

describe('Template', () => {
  afterEach(() => {
    pushedRoutes = []
    cookiesRemoved = []
  })
  it('should render Template component', async () => {
    const { container } = render(
      <Template>
        <div />
      </Template>
    )

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should navigate through the routes', async () => {
    const { container } = render(
      <Template>
        <div />
      </Template>
    )

    const projectsRoute = screen.getByText('Projects')
    const tutorialAndDocsRoute = screen.getByText('Tutorial And Docs')
    const helpAndSupportRoute = screen.getByText('Help And Support')
    const myAccountRoute = screen.getByText('My Account')

    fireEvent.click(projectsRoute)
    fireEvent.click(tutorialAndDocsRoute)
    fireEvent.click(helpAndSupportRoute)
    fireEvent.click(myAccountRoute)

    expect(pushedRoutes.includes('/')).toBe(true)
    expect(pushedRoutes.includes('/dashboard/tutorials-and-docs')).toBe(true)
    expect(pushedRoutes.includes('/dashboard/help-and-support')).toBe(true)
    expect(pushedRoutes.includes('/dashboard/my-account')).toBe(true)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should change organization', async () => {
    const { container } = render(
      <Template>
        <div />
      </Template>
    )

    const dropdownButton = screen.getByTitle('Organization')

    fireEvent.click(dropdownButton)
    const UXTudoOrganization = screen.getByText('UX-tudo')
    fireEvent.click(UXTudoOrganization)

    expect(screen.getByText('Free')).toBeInTheDocument()

    fireEvent.click(dropdownButton)
    const orgTopOrganization = screen.getByText('Org TOP')
    fireEvent.click(orgTopOrganization)

    expect(screen.getByText('Top')).toBeInTheDocument()

    fireEvent.click(dropdownButton)

    const seniorsDemaisOrganization = screen.getByText('Seniors Demais')
    fireEvent.click(seniorsDemaisOrganization)

    expect(screen.getByText('Starter')).toBeInTheDocument()

    fireEvent.click(dropdownButton)

    fireEvent.click(screen.getByText('Create new organization'))

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should remove cookies when logout', async () => {
    render(
      <Template>
        <div />
      </Template>
    )

    const logOutButton = screen.getByText('Logout')

    fireEvent.click(logOutButton)
    expect(cookiesRemoved.includes('X-TenantID')).toBe(true)
    expect(cookiesRemoved.includes('admin_access_token')).toBe(true)
    expect(cookiesRemoved.includes('access_token')).toBe(true)
  })

  it('should open sidebar', async () => {
    render(
      <Template>
        <div />
      </Template>
    )

    const openSidebarButton = screen.getByTitle('open sidebar')

    fireEvent.click(openSidebarButton)

    expect(screen.getByTestId('sidebarLogout')).toBeInTheDocument()
  })

  it('should handle sidebar logout', async () => {
    render(
      <Template>
        <div />
      </Template>
    )

    const openSidebarButton = screen.getByTitle('open sidebar')

    fireEvent.click(openSidebarButton)

    const sidebarLogout = screen.getByTestId('sidebarLogout')

    fireEvent.click(sidebarLogout)
    expect(cookiesRemoved.includes('X-TenantID')).toBe(true)
    expect(cookiesRemoved.includes('admin_access_token')).toBe(true)
    expect(cookiesRemoved.includes('access_token')).toBe(true)
  })

  it('should navigate through the sidebar routes', async () => {
    const { container } = render(
      <Template>
        <div />
      </Template>
    )

    const openSidebarButton = screen.getByTitle('open sidebar')

    fireEvent.click(openSidebarButton)


    const projectsRoute = screen.getByTestId('Projects')

    fireEvent.click(projectsRoute)

    expect(pushedRoutes.includes('/')).toBe(true)
  })
})
