import { Dispatch, SetStateAction } from 'react'
import * as common from '..'

type TabsProps = {
  tabs: Tab[]
  selectedTab?: Tab
  setSelectedTab: Dispatch<SetStateAction<Tab>>
  onchange?: () => void
}

type Tab = {
  name: string
  icon?: (props: React.ComponentProps<'svg'>) => JSX.Element
}

export function Tabs({
  tabs,
  selectedTab = tabs[0],
  setSelectedTab,
  onchange
}: TabsProps) {
  return (
    <div className=" w-full  h-full ">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <common.Select
          options={
            tabs ? tabs.map((tab) => ({ value: tab.name, name: tab.name })) : []
          }
          value={{ value: selectedTab.name, name: selectedTab.name }}
          onChange={(val) => {
            const tab = tabs.find((tab) => tab.name === val.value)
            tab && setSelectedTab(tab)
          }}
        />
      </div>
      <div className="hidden sm:block h-full">
        <div className="h-full">
          <nav
            className="flex justify-center w-full -mb-px h-full "
            aria-label="Tabs roudend-t-md"
          >
            {tabs.map((tab) => (
              <button
                key={tab.name}
                type="button"
                className={`${
                  tab.name === selectedTab.name
                    ? 'border-transparent text-indigo-500 bg-white dark:bg-menu-primary dark:text-text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:bg-menu-secondary/30 hover:border-gray-300 dark:text-text-tertiary dark:hover:text-text-primary dark:hover:border-menu-secondary/70 bg-gray-200'
                }
                  group h-full inline-flex items-center py-5 px-1 border-b-2 font-medium text-xs cursor-pointer justify-center flex-1`}
                aria-current={
                  tab.name === selectedTab.name ? 'page' : undefined
                }
                onClick={() => {
                  setSelectedTab(tab)
                  if (onchange) {
                    onchange()
                  }
                }}
                title={tab.name}
              >
                {tab.icon && (
                  <tab.icon
                    className={`${
                      tab.name === selectedTab.name
                        ? 'text-indigo-500'
                        : 'text-gray-400 group-hover:text-gray-500'
                    } -ml-0.5 mr-2 h-5 w-5`}
                    aria-hidden="true"
                  />
                )}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
