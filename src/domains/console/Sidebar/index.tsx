import * as consoleSection from 'domains/console'
import { Icon } from '@iconify/react'
import { ArrowLeftIcon, UserIcon } from '@heroicons/react/outline'

export function SideBar() {
  const { setCurrentTab, currentTab } = consoleSection.useData()
  return (
    <div className="w-[30%] h-full max-h-screen text-gray-600 bg-white rounded-lg flex flex-col">
      <div className="flex items-center justify-between w-full p-3 bg-gray-200 rounded-t-lg">
        <button>
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <p className="text-lg font-bold">Academia</p>
        <div className="flex gap-2">
          <button className="flex items-center justify-center w-6 h-6 border border-gray-400 rounded">
            <UserIcon className="w-5 h-5" />
          </button>
          <button className="flex items-center justify-center w-6 h-6 border border-gray-400 rounded">
            <Icon icon="vscode-icons:file-type-config" className={`w-5 h-5`} />
          </button>
        </div>
      </div>

      <div className="flex justify-between mx-4 mt-4 text-white bg-gray-700 rounded-lg">
        <button
          className={`flex-1 rounded-lg transition ${
            currentTab === 'API' ? 'bg-gray-300 text-gray-700' : ''
          }`}
          onClick={() => {
            setCurrentTab('API')
          }}
        >
          API
        </button>
        <button
          className={`flex-1 rounded-lg transition ${
            currentTab === 'DATA' ? 'bg-gray-300 text-gray-700' : ''
          }`}
          onClick={() => {
            setCurrentTab('DATA')
          }}
        >
          DATA
        </button>
      </div>
      {currentTab === 'API' ? (
        <consoleSection.ApiTab />
      ) : (
        <consoleSection.DataTab />
      )}
    </div>
  )
}
