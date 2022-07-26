import { useEffect } from 'react'
import * as consoleSection from 'domains/console'
import * as common from 'common'
import { useRouter } from 'next/router'

export function SideBar() {
  const router = useRouter()
  const { selectedTab, setSelectedTab } = consoleSection.useSidebar()
  const { setCurrentTab, currentTab } = consoleSection.useData()

  useEffect(() => {
    setCurrentTab(selectedTab.name as 'API' | 'DATA')
  }, [selectedTab])

  const teste = [
    { titles: 'Schema Manager', content: <consoleSection.DataTab /> },
    { titles: 'Data Manager', content: <consoleSection.ApiTab /> }
  ]
  return (
    <div className="text-gray-600  w-[20%] h-full flex flex-col bg-theme-primary">
      {teste.map((t, idx) => {
        return (
          <common.Accordion titles={t.titles} content={t.content} key={idx} />
        )
      })}
    </div>
  )
}
