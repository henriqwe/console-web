import { useEffect } from 'react'
import * as consoleSection from 'domains/console'
import * as common from 'common'
import { DatabaseIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'

export function SideBar() {
  const router = useRouter()
  const { selectedTab, setSelectedTab } = consoleSection.useSidebar()
  const { setCurrentTab, currentTab } = consoleSection.useData()

  useEffect(() => {
    setCurrentTab(selectedTab.name as 'CONSOLE' | 'DATA')
  }, [selectedTab])

  return (
    <div className="text-gray-600 rounded-lg w-[30%] h-full flex flex-col">
      <div className="flex items-center justify-between w-full pt-7 pb-2  bg-theme-1">
        <div>
          <img
            src="/assets/images/logoTextDark.png"
            alt="Logo"
            className="w-auto h-8"
          />
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between w-full py-4 rounded-t-lg bg-theme-1">
          <common.Tabs
            tabs={[
              {
                name: 'CONSOLE',
                icon: common.icons.ConsoleIcon
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
