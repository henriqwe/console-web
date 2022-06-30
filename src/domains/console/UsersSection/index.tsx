import * as common from 'common'
import * as consoleData from 'domains/console'
import { useState } from 'react'

export function UsersSection() {
  const [selectedTab, setSelectedTab] = useState({
    name: 'Accounts'
  })

  return (
    <common.Card className="flex flex-col h-full">
      <div className="flex items-center w-full px-4 bg-gray-200 border-gray-300 rounded-t-lg min-h-[4rem] border-x gap-2">
        <p className="text-lg font-bold text-gray-700">
          Accounts and Roles Panel
        </p>
      </div>

      <div>
        <common.Tabs
          tabs={[{ name: 'Accounts' }, { name: 'Roles' }]}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        {selectedTab.name === 'Accounts' ? (
          <consoleData.AccountTab />
        ) : (
          <consoleData.RoleTab />
        )}
      </div>
    </common.Card>
  )
}
