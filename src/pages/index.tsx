/* This example requires Tailwind CSS v2.0+ */
import * as consoleSection from 'domains/console'

import { DatabaseIcon, UserIcon } from '@heroicons/react/outline'

const user = {
  name: 'Emily Selman',
  email: 'emily.selman@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
}
const navigation = [
  { name: 'Data', href: 'http://localhost:3000', icon: DatabaseIcon },
  { name: 'Users', href: 'http://localhost:3000/user', icon: UserIcon }
]

export default function Home() {
  return (
    <consoleSection.DataProvider>
      <Page />
    </consoleSection.DataProvider>
  )
}

function Page() {
  const { currentTab } = consoleSection.useData()
  return (
    <div className="flex h-[100vh] gap-4 p-6 bg-orange-400 max-h-[100vh]">
      <consoleSection.SideBar />

      {currentTab === 'API' ? (
        <consoleSection.ApiSection />
      ) : (
        <consoleSection.DataSection />
      )}
    </div>
  )
}
