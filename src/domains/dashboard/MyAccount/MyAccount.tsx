import * as common from 'common'
import { Profile } from './Profile'
import { Billing } from './Billing'
import { useState } from 'react'

export function MyAccount() {
  const [selectedTab, setSelectedTab] = useState({ name: 'Profile' })

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
          <common.Breadcrumb
            pages={[
              { content: 'My Account', current: false },
              { content: '', current: false }
            ]}
          />
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {selectedTab.name === 'Profile' ? 'Profile' : 'Billing'}
          </h1>
        </div>
        <div className="flex flex-col gap-y-8 sm:gap-y-0">
          <div className="w-full sm:w-48 rounded-t-lg overflow-hidden self-end dark:border-gray-700 sm:border sm:border-b-0 -mb-[1px] z-20">
            <common.Tabs
              selectedTab={selectedTab}
              setSelectedTab={(tab) => {
                setSelectedTab(tab)
              }}
              tabs={[{ name: 'Profile' }, { name: 'Billing' }]}
            />
          </div>
          <section className="flex dark:bg-menu-primary dark:border-gray-700 sm:border sm:rounded-tr-none bg-white overflow-hidden rounded-lg">
            <div className="flex flex-col py-10 w-full">
              {selectedTab.name === 'Profile' ? <Profile /> : <Billing />}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
