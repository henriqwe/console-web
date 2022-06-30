import * as consoleSection from 'domains/console'
import { Header } from 'domains/console/Header'
export default function Home() {
  return (
    <consoleSection.DataProvider>
      <consoleSection.ConsoleEditorProvider>
        <consoleSection.UserProvider>
          <Page />
        </consoleSection.UserProvider>
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
