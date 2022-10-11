import * as consoleSection from 'domains/console'
import cookie from 'cookie'
import { GetServerSideProps } from 'next'
import { TourProvider } from '@reactour/tour'
import Head from 'next/head'
import { useRouter } from 'next/router'

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
    <>
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
        <consoleSection.SchemaManagerProvider>
          <consoleSection.ConsoleEditorProvider>
            <consoleSection.SidebarProvider>
              <consoleSection.UserProvider>
                {/* {!cookie.admin_access_token ? (
                <consoleSection.AdminLogin />
              ) : ( */}
                <Page />
                {/* )} */}
              </consoleSection.UserProvider>
            </consoleSection.SidebarProvider>
          </consoleSection.ConsoleEditorProvider>
        </consoleSection.SchemaManagerProvider>
      </TourProvider>
    </>
  )
}

function Page() {
  const router = useRouter()
  const { name } = router.query

  let formattedName = ''
  if (typeof name === 'string') {
    formattedName = name?.charAt(0).toUpperCase() + name?.slice(1)
  }

  return (
    <>
      <Head>
        <title>{formattedName} - Console</title>
      </Head>
      <consoleSection.ViewConsole />
    </>
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
