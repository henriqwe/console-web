import * as consoleSection from 'domains/console'
import cookie from 'cookie'
import { Header } from 'domains/console/Header'
import { GetServerSideProps } from 'next'
import { TourProvider, useTour } from '@reactour/tour'
import { useEffect } from 'react'
import * as common from 'common'
import * as consoleEditor from 'domains/console/ConsoleEditorContext'

export default function Home({
  cookie
}: {
  cookie: { admin_access_token?: string }
}) {
  const tourSteps = [
    {
      selector: '[data-tour="step-1"]',
      content: <p>Lorem ipsum dolor sit amet</p>
    },
    {
      selector: '[data-tour="step-2"]',
      content: <p>consectetur adipiscing elit</p>
    },
    {
      selector: '[data-tour="step-3"]',
      content: <p>consectetur adipiscing elit</p>
    }
  ]

  return (
    <TourProvider
      steps={tourSteps}
      styles={{
        popover: (base) => ({
          ...base,
          '--reactour-accent': '#6366F1',
          borderRadius: 10
        }),
        maskArea: (base) => ({ ...base, rx: 10 }),
        maskWrapper: (base) => ({ ...base, color: '#6366F1' }),
        badge: (base) => ({ ...base }),
        controls: (base) => ({ ...base, marginTop: 50 }),
        close: (base) => ({ ...base, right: 8, top: 8 })
      }}
    >
      <consoleSection.DataProvider>
        <consoleSection.ConsoleEditorProvider>
          <consoleSection.SidebarProvider>
            <consoleSection.UserProvider>
              {!cookie.admin_access_token ? (
                <consoleSection.AdminLogin />
              ) : (
                <Page />
              )}
            </consoleSection.UserProvider>
          </consoleSection.SidebarProvider>
        </consoleSection.ConsoleEditorProvider>
      </consoleSection.DataProvider>
    </TourProvider>
  )
}

function Page() {
  const { currentTab, setCurrentTab } = consoleSection.useData()
  const { setIsOpen, currentStep, setSteps, isOpen, setCurrentStep } = useTour()
  const { tabsData } = consoleEditor.useConsoleEditor()

  let tab = <consoleSection.DataManagerSection />
  switch (currentTab) {
    case 'Schema Manager':
      tab = <consoleSection.SchemaManagerSection />
      break
    case 'Schema Manager':
      tab = <consoleSection.DataManagerSection />
      break
    case 'USERS':
      tab = <consoleSection.UsersSection />
      break
  }

  return (
    <div className="bg-[#EDEDEC] h-[100vh] max-h-[100vh] flex flex-col">
      <common.SlideWithTabs tabsData={tabsData} />
      <Header />
      <div className="flex h-full w-full ">
        <consoleSection.SideBar />
        <div className="flex flex-1 h-full ">{tab}</div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (props) => {
  const cookies = cookie.parse(props.req.headers.cookie as string)
  return {
    props: {
      cookie: cookies
    }
  }
}
