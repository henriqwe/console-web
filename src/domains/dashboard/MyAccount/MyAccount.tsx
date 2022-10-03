import * as Common from 'common'
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
          <p className="text-xs dark:text-gray-500">
            My Account <span className="ml-1"> {'>'} </span>
          </p>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {selectedTab.name === 'Profile' ? 'Profile' : 'Billing'}
          </h1>
        </div>
        <div className="flex flex-col rounded-lg overflow-hidden dark:border-gray-700 sm:border gap-y-8 sm:gap-y-0">
          <Common.Tabs
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            tabs={[{ name: 'Profile' }, { name: 'Billing' }]}
          />
          <section className="flex dark:bg-menu-primary bg-white overflow-hidden rounded-lg">
            <div className="flex flex-col py-10 w-full">
              {selectedTab.name === 'Profile' ? <Profile /> : <Billing />}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
