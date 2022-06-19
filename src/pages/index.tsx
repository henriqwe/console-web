import * as consoleSection from 'domains/console'
import { Header } from 'domains/console/Header'

export default function Home() {
  return (
    <consoleSection.DataProvider>
      <Page />
    </consoleSection.DataProvider>
  )
}

function Page() {
  const { currentTab } = consoleSection.useData()
  return (
    <div className="flex h-[100vh] gap-4 p-6 bg-theme-1 max-h-[100vh]">
      <consoleSection.SideBar />
      <div className="flex flex-col w-full">
        <div>
          <Header />
        </div>
        <div className="flex w-full h-full">
          {currentTab === 'CONSOLE' ? (
            <consoleSection.ApiSection />
          ) : (
            <consoleSection.DataSection />
          )}
        </div>
      </div>
    </div>
  )
}
