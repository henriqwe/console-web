import * as consoleSection from 'domains/console'
import cookie from 'cookie'
import { Header } from 'domains/console/Header'
import { GetServerSideProps } from 'next'
import { TourProvider, useTour } from '@reactour/tour'
import { useEffect } from 'react'

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

  let tab = <consoleSection.ApiSection />
  switch (currentTab) {
    case 'DATA':
      tab = <consoleSection.DataSection />
      break

    case 'USERS':
      tab = <consoleSection.UsersSection />
      break
  }

  console.log(currentStep)

  useEffect(() => {
    setIsOpen(true)
  }, [])

  useEffect(() => {
    if (currentTab === 'API') {
      setSteps([
        {
          selector: '[data-tour="step-4"]',
          content: <p>consectetur adipiscing elit</p>
        }
      ])
      setCurrentStep(0)
      setIsOpen(true)
    }
  }, [currentTab])

  return (
    <div className="bg-theme-primary h-[100vh]">
      <div className="flex h-[100vh] gap-4 px-6 max-h-[97vh]">
        <consoleSection.SideBar />
        <div className="flex flex-col w-full">
          <Header />
          <div className="flex w-full h-full">{tab}</div>
        </div>
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
