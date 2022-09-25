import * as common from 'common'
import { Header } from 'domains/console/Header'
import * as consoleSection from 'domains/console'
import { useTour } from '@reactour/tour'
import { useEffect } from 'react'
import * as consoleEditor from 'domains/console/ConsoleEditorContext'
import { SchemaFormater } from 'domains/console/DataApiSection/Console/Editors/SchemaFormater'

export function ViewConsole() {
  const { currentTab } = consoleSection.useSchemaManager()
  const { setIsOpen, currentStep, setSteps, isOpen, setCurrentStep } = useTour()
  const { tabsData, documentationValue, setSchemaTabData } =
    consoleEditor.useConsoleEditor()

  let tab = <consoleSection.DataApiSection />
  switch (currentTab) {
    case 'Schema':
      tab = <consoleSection.SchemaManagerSection />
      break
    case 'Data Api':
      tab = <consoleSection.DataApiSection />
      break
    case 'USERS':
      tab = <consoleSection.UsersSection />
      break
  }
  useEffect(() => {
    if (documentationValue) {
      setSchemaTabData(<SchemaFormater />)
    }
  }, [documentationValue])

  return (
    <div className="bg-[#EDEDEC] dark:bg-bg-page h-[100vh] max-h-[100vh] flex flex-col">
      <common.SlideWithTabs tabsData={tabsData ?? []} />
      <Header />
      <div className="flex h-full w-full ">
        <consoleSection.SideBar />
        <div className="flex flex-1 h-full ">{tab}</div>
      </div>
    </div>
  )
}
