import { useEffect } from 'react'
import * as consoleSection from 'domains/console'
import * as common from 'common'
type accordionsDatatype = {
  id: number
  title: 'Data Manager' | 'Schema Manager' | 'USERS'
  content: JSX.Element
  defaultOpen: boolean
  action: () => void
}[]

export function SideBar() {
  const { selectedTab } = consoleSection.useSidebar()
  const { setCurrentTab } = consoleSection.useData()

  useEffect(() => {
    setCurrentTab(selectedTab.name as 'Data Manager' | 'Schema Manager')
  }, [selectedTab])

  const accordionsData: accordionsDatatype = [
    {
      id: 1,
      title: 'Schema Manager',
      content: <consoleSection.DataTab />,
      defaultOpen: true,
      action: () => setCurrentTab('Schema Manager')
    },
    {
      id: 2,
      title: 'Data Manager',
      content: <consoleSection.ApiTab />,
      defaultOpen: false,
      action: () => setCurrentTab('Data Manager')
    }
  ]
  return (
    <div className="text-gray-600  w-[20%] h-full flex flex-col bg-theme-primary">
      <common.AccordionGroup accordionsData={accordionsData} />
    </div>
  )
}
