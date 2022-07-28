import { useEffect } from 'react'
import * as consoleSection from 'domains/console'
import * as common from 'common'
import { useRouter } from 'next/router'

export function SideBar() {
  const router = useRouter()
  const { selectedTab, setSelectedTab } = consoleSection.useSidebar()
  const { setCurrentTab, currentTab } = consoleSection.useData()

  useEffect(() => {
    setCurrentTab(selectedTab.name as 'Data Manager' | 'Schema Manager')
  }, [selectedTab])

  const teste = [
    { title: 'Schema Manager', content: <consoleSection.DataTab /> },
    { title: 'Data Manager', content: <consoleSection.ApiTab /> }
  ]
  return (
    <div className="text-gray-600  w-[20%] h-full flex flex-col bg-theme-primary">
      {teste.map((t, idx) => {
        return (
          <div
            onClick={() => {
              setCurrentTab(t.title)
            }}
            key={idx}
          >
            <common.Accordion titles={t.title} content={t.content} />
          </div>
        )
      })}
    </div>
  )
}
