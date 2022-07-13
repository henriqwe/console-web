import * as consoleSection from 'domains/console'
import cookie from 'cookie'
import * as utils from 'utils'
import { Header } from 'domains/console/Header'
import { GetServerSideProps } from 'next'

export default function Home({
  cookie
}: {
  cookie: { admin_access_token?: string }
}) {
  return (
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
  )
}

function Page() {
  const { currentTab } = consoleSection.useData()
  let tab = <consoleSection.ApiSection />
  switch (currentTab) {
    case 'DATA':
      tab = <consoleSection.DataSection />
      break

    case 'USERS':
      tab = <consoleSection.UsersSection />
      break
  }
  return (
    <div className="flex h-[100vh] gap-4 p-6 bg-theme-1 max-h-[100vh]">
      <consoleSection.SideBar />
      <div className="flex flex-col w-full">
        <div>
          <Header />
        </div>
        <div className="flex w-full h-full">{tab}</div>
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
