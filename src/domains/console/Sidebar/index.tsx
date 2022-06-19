import { useEffect, useState } from 'react'
import * as consoleSection from 'domains/console'
import * as common from 'common'
import { Icon } from '@iconify/react'
import { ArrowLeftIcon, UserIcon, DatabaseIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'

export function SideBar() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState<{ name: string; icon?: any }>({
    name: 'CONSOLE',
    icon: DatabaseIcon
  })

  useEffect(() => {
    setCurrentTab(selectedTab.name as 'CONSOLE' | 'DATA')
  }, [selectedTab])

  const { setCurrentTab, currentTab } = consoleSection.useData()
  return (
    <div className="text-gray-600 rounded-lg w-[30%] h-full flex flex-col">
      <div className="flex items-center justify-between w-full pt-6 pb-3 pl-6 bg-theme-1">
        <div className="w-40">
          <img src="/assets/images/logoTextDark.png" alt="Logo" />
        </div>
        <button
          className="flex items-center justify-center w-10 h-10 bg-gray-200 border border-gray-400 rounded-[0.65rem] hover:bg-red-400 hover:text-white hover:border-red-400 transition"
          onClick={() => router.push('/dashboard')}
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
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </div>
      </div>

      {currentTab === 'CONSOLE' ? (
        <consoleSection.ApiTab />
      ) : (
        <consoleSection.DataTab />
      )}
    </div>
  )
}
