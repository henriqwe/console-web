import * as common from 'common'
import { Cards } from './Cards'
import { Profile } from './Profile'
import { Billing } from './Billing/Billing'
import { useState } from 'react'

type tabTypes = {
  name: 'Profile' | 'Billing' | 'Cards'
}
export function MyAccount() {
  const [selectedTab, setSelectedTab] = useState<tabTypes>({ name: 'Profile' })

  const tabs = {
    Profile: <Profile />,
    Billing: <Billing />,
    Cards: <Cards />
  }

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
                { content: 'My Account', current: false },
                { content: '', current: false }
              ]}
            />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {selectedTab.name}
            </h1>
          </div>
          <div className="w-full sm:w-56 rounded-t-lg overflow-hidden self-end dark:border-gray-700 sm:border sm:border-b-0 -mb-[1px] z-20 h-20">
            <common.Tabs
              selectedTab={selectedTab}
              setSelectedTab={(tab) => {
                setSelectedTab(tab as tabTypes)
              }}
              tabs={[
                { name: 'Profile' },
                { name: 'Billing' },
                { name: 'Cards' }
              ]}
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-8 sm:gap-y-0">
          <section className="flex overflow-hidden bg-white rounded-lg dark:bg-menu-primary dark:border-gray-700 sm:border sm:rounded-tr-none">
            <div className="flex flex-col w-full py-10">
              {tabs[selectedTab.name]}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
