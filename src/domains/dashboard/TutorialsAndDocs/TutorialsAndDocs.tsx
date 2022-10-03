import * as Common from 'common'
import { Tutorials } from './Tutorials'
import { Docs } from './Docs'
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
      <div className="z-20 flex flex-col w-full gap-y-8">
        <div className="flex flex-col">
          <p className="text-xs dark:text-gray-500">
            Tutorials and Docs <span className="ml-1"> {'>'} </span>
          </p>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {selectedTab.name === 'Tutorials' ? 'Tutorials' : 'Docs'}
          </h1>
        </div>
        <div className="flex flex-col gap-y-8 sm:gap-y-0">
          <div className="w-full sm:w-48 rounded-t-lg overflow-hidden self-end dark:border-gray-700 sm:border sm:border-b-0 -mb-[1px] z-10">
            <Common.Tabs
              selectedTab={selectedTab}
              setSelectedTab={(tab) => {
                setSelectedTab(tab)
              }}
              tabs={[{ name: 'Tutorials' }, { name: 'Docs' }]}
            />
          </div>
          <section className="flex dark:bg-menu-primary dark:border-gray-700 sm:border bg-white overflow-hidden rounded-lg rounded-tr-none">
            <div className="flex flex-col py-10 w-full">
              {selectedTab.name === 'Tutorials' ? <Tutorials /> : <Docs />}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
