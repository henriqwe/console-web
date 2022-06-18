import * as consoleSection from 'domains/console'

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
    <div className="flex h-[100vh] gap-4 p-6 bg-gray-300 max-h-[100vh]">
      <consoleSection.SideBar />

      {currentTab === 'API' ? (
        <consoleSection.ApiSection />
      ) : (
        <consoleSection.DataSection />
      )}
    </div>
  )
}
