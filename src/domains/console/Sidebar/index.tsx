import { useState } from 'react'
import * as consoleSection from 'domains/console'
import * as common from 'common'
import { Icon } from '@iconify/react'
import { ArrowLeftIcon, UserIcon, DatabaseIcon } from '@heroicons/react/outline'

export function SideBar() {
  const [selectedTab, setSelectedTab] = useState({
    name: 'CONSOLE',
    icon: DatabaseIcon
  })
  const { setCurrentTab, currentTab } = consoleSection.useData()
  return (
    <div className="w-[30%] h-full max-h-screen text-gray-600 flex flex-col gap-4">
      <div className="flex justify-between w-full">
        <div className="w-40">
          <img src="/assets/images/logoTextDark.png" alt="Logo" />
        </div>
        <button className="flex items-center justify-center w-10 h-10 bg-gray-300 border border-gray-400 rounded">
          <ArrowLeftIcon className="w-8 h-8" />
        </button>
      </div>
      <div className="flex flex-col h-full max-h-[90%] text-gray-600 bg-white rounded-lg ">
        <div className="flex items-center justify-between w-full bg-gray-200 rounded-t-lg">
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
          {/* <button>
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <p className="text-lg font-bold">Academia</p>
          <div className="flex gap-2">
            <button className="flex items-center justify-center w-6 h-6 border border-gray-400 rounded">
              <UserIcon className="w-5 h-5" />
            </button>
            <button className="flex items-center justify-center w-6 h-6 border border-gray-400 rounded">
              <Icon
                icon="vscode-icons:file-type-config"
                className={`w-5 h-5`}
              />
            </button>
          </div> */}
        </div>

        {currentTab === 'API' ? (
          <consoleSection.ApiTab />
        ) : (
          <consoleSection.DataTab />
        )}
      </div>
    </div>
  )
}
