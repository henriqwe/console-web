import { Dispatch, SetStateAction } from 'react'

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
    <div className="w-full">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          defaultValue={selectedTab.name}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200 dark:border-menu-primary">
          <nav
            className="flex justify-center w-full -mb-px"
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
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-xs cursor-pointer justify-center flex-1`}
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
