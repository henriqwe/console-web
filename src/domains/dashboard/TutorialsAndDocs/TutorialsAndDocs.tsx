import * as common from 'common'
import { Docs } from './Docs'
import { useState } from 'react'

export function TutorialsAndDocs() {
  const [selectedTab, setSelectedTab] = useState({ name: 'Docs' }) //Tutorials
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
      <div className="z-20 flex flex-col w-full ">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <common.Breadcrumb
              pages={[
                { content: 'Tutorials and Docs', current: false },
                { content: '', current: false }
              ]}
            />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {/* {selectedTab.name === 'Tutorials' ? 'Tutorials' : 'Docs'} */}
              Docs
            </h1>
          </div>
          <div className="w-full sm:w-48 rounded-t-lg overflow-hidden self-end dark:border-gray-700 sm:border sm:border-b-0 -mb-[1px] z-10 h-20">
            <common.Tabs
              selectedTab={selectedTab}
              setSelectedTab={(tab) => {
                setSelectedTab(tab)
              }}
              tabs={[/*{ name: 'Tutorials' }, */ { name: 'Docs' }]}
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-8 sm:gap-y-0">
          <section className="flex overflow-hidden bg-white rounded-lg rounded-tr-none dark:bg-menu-primary dark:border-gray-700 sm:border">
            <div className="flex flex-col w-full">
              {/*selectedTab.name === 'Tutorials' ? <Tutorials />  null : (*/}

              <Docs />
              {/* )} */}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
