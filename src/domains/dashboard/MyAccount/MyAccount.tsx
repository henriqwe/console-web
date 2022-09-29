import * as common from 'common'
import * as dashboard from 'domains/dashboard'
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
      <div className="z-20 flex flex-col w-4/6 gap-y-8">
        <div className="flex flex-col">
          <p className="text-xs dark:text-gray-500">
            My Account <span className="ml-1"> {'>'} </span>
          </p>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {selectedTab.name === 'Profile' ? 'Profile' : 'Billing'}
          </h1>
        </div>
        <div className="flex flex-col rounded-lg overflow-hidden dark:border-gray-700 sm:border gap-y-8 sm:gap-y-0">
          <common.Tabs
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            tabs={[{ name: 'Profile' }, { name: 'Billing' }]}
          />
          <section className="flex dark:bg-menu-primary bg-white">
            <div className="flex flex-col py-10 w-full">
              {selectedTab.name === 'Profile' ? <Profile /> : <Billing />}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function Profile() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-10 w-full">
      <div className="flex flex-col gap-y-4 px-4">
        <p className="dark:text-text-primary text-xl">My Info</p>
      </div>
      <div className="flex flex-col gap-y-4 px-4">
        <p className="dark:text-text-primary text-xl">Address</p>
      </div>
    </div>
  )
}

function Billing() {
  return (
    <p className="px-4 text-2xl font-semibold text-gray-900 dark:text-white">
      Billing
    </p>
  )
}
