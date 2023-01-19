import {
  render,
  screen,
  fireEvent,
  waitFor,
  renderHook
} from '@testing-library/react'
import { SidebarProvider, useSidebar } from './SidebarContext'
import '@testing-library/jest-dom'


describe('SideBar', () => {


  it('should render SideBar component', () => {
    function Component() {
      const {
        // result: {
        //   current: { selectedTab }
        // }
        selectedTab
      } = useSidebar()

      return <div>{selectedTab.name}</div>
    }

    const { container } = render(
      <SidebarProvider>
        <Component />
      </SidebarProvider>
    )

    expect(container.firstChild).toBeInTheDocument()
  })
})
