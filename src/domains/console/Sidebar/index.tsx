import { useEffect } from 'react'
import * as consoleSection from 'domains/console'
import * as common from 'common'
import { ArrowLeftIcon, DatabaseIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import { routes } from 'domains/routes'

export function SideBar() {
  const router = useRouter()
  const { selectedTab, setSelectedTab } = consoleSection.useSidebar()
  const { setCurrentTab, currentTab, setShowTableViewMode } =
    consoleSection.useData()

  useEffect(() => {
    setCurrentTab(selectedTab.name as 'CONSOLE' | 'DATA')
  }, [selectedTab])

  return (
    <div className="text-gray-600 rounded-lg w-[30%] h-full flex flex-col">
      <div className="flex items-center justify-between w-full pt-6 pb-3 pl-6 bg-theme-1">
        <div className="w-40">
          <img src="/assets/images/logoTextDark.png" alt="Logo" />
        </div>
        <button
          className="flex items-center justify-center w-10 h-10 bg-gray-200 border border-gray-400 rounded-[0.65rem] hover:bg-red-400 hover:text-white hover:border-red-400 transition"
          onClick={() => router.push(routes.dashboard)}
          type="button"
        >
          <ArrowLeftIcon className="w-8 h-8" />
        </button>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between w-full px-8 py-4 rounded-t-lg bg-theme-1">
          <common.Tabs
            tabs={[
              {
                name: 'CONSOLE',
                icon: DatabaseIcon
              },
              {
                name: 'DATA',
                icon: DatabaseIcon
              }
            ]}
            selectedTab={
              currentTab !== 'USERS' ? selectedTab : { name: 'USERS' }
            }
            setSelectedTab={setSelectedTab}
            onchange={() => setShowTableViewMode(false)}
          />
        </div>
      </div>

      {currentTab === 'CONSOLE' ? (
        <consoleSection.ApiTab />
      ) : currentTab === 'DATA' ? (
        <consoleSection.DataTab />
      ) : (
        <div className="flex flex-col h-full px-6 pt-2 overflow-y-auto bg-gray-100 rounded-b-lg">
          <p>Select a tab to see data or api tab</p>
        </div>
      )}
    </div>
  )
}
