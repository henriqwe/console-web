import * as Common from 'common'
import { Tutorials } from './Tutorials'
import { useState } from 'react'

export function TutorialsAndDocs() {
  const [selectedTab, setSelectedTab] = useState({ name: 'Tutorials' })
  return (
    <div className="flex justify-center">
      <div className="absolute inset-x-0 top-0 z-10 flex justify-center pointer-events-none blur-xl">
        <div className="flex justify-end flex-none w-full">
          <img
            src="/assets/images/green-blur-test.png"
            alt=""
            className="w-[71.75rem] flex-none max-w-none"
          />
        </div>
      </div>
      <div className="z-20 flex flex-col w-full mx-10 lg:w-4/6 gap-y-8">
        <div className="flex flex-col">
          <p className="text-xs dark:text-gray-500">
            Tutorials and Docs <span className="ml-1"> {'>'} </span>
          </p>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {selectedTab.name === 'Tutorials' ? 'Tutorials' : 'Docs'}
          </h1>
        </div>
        <div className="flex flex-col rounded-lg overflow-hidden dark:border-gray-700 sm:border gap-y-8 sm:gap-y-0">
          <Common.Tabs
            selectedTab={selectedTab}
            setSelectedTab={(tab) => {
              if (tab.name === 'Docs') {
                window.open('https://docs.ycodify.com/', '_blank')
                return
              }
              setSelectedTab(tab)
            }}
            tabs={[{ name: 'Tutorials' }, { name: 'Docs' }]}
          />
          <section className="flex dark:bg-menu-primary bg-white overflow-hidden rounded-lg">
            <div className="flex flex-col py-10 w-full">
              {selectedTab.name === 'Tutorials' ? <Tutorials /> : '<Docs />'}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
