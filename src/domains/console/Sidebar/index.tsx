import { useEffect } from 'react'
import * as consoleSection from 'domains/console'
import * as common from 'common'
import type { currentTabType } from 'domains/console/SchemaManagerContext'
type accordionsDatatype = {
  id: number
  title: currentTabType
  content: JSX.Element
  defaultOpen: boolean
  action: () => void
}[]

export function SideBar() {
  const { selectedTab } = consoleSection.useSidebar()
  const { setCurrentTab } = consoleSection.useSchemaManager()

  useEffect(() => {
    setCurrentTab(selectedTab.name)
  }, [selectedTab])

  const accordionsData: accordionsDatatype = [
    {
      id: 1,
      title: 'Schema',
      content: <consoleSection.SchemaManagerTab />,
      defaultOpen: true,
      action: () => setCurrentTab('Schema')
    },
    {
      id: 2,
      title: 'Data Api',
      content: <consoleSection.DataApiTab />,
      defaultOpen: false,
      action: () => setCurrentTab('Data Api')
    }
  ]
  return (
    <div className="text-gray-600 border-r border-white dark:border-gray-700/75 w-[20%] h-full flex flex-col bg-theme-primary dark:bg-bg-navigation">
      <common.AccordionGroup accordionsData={accordionsData} />
    </div>
  )
}
