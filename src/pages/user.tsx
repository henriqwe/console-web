/* This example requires Tailwind CSS v2.0+ */
import * as users from 'domains/user'
import * as common from 'common'
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

export default function Users() {
  return (
    <users.UsersProvider>
      <Page />
    </users.UsersProvider>
  )
}

function Page() {
  return (
    <users.UsersProvider>
      <common.Template menuItens={navigation} user={user}>
        <div className="flex w-full">
          <users.Roles />
          <users.Users />
        </div>
      </common.Template>
    </users.UsersProvider>
  )
}
