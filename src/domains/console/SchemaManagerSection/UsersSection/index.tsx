import * as common from 'common'
import * as consoleData from 'domains/console'
import * as SchemaManagerContext from 'domains/console'
import * as UserContext from 'contexts/UserContext'
import { Tour as UsersTour } from './UsersTab/Tour'
import { Tour as RolesTour } from './RoleTab/Tour'

export function UsersSection() {
  const { selectedTabUsersAndRoles } = SchemaManagerContext.useSchemaManager()
  const { user } = UserContext.useUser()

  return (
    <>
      {user?.adminSchemaPassword ? (
        selectedTabUsersAndRoles.name === 'Users' ? (
          <UsersTour />
        ) : (
          <RolesTour />
        )
      ) : null}
      <common.Card className="flex flex-col h-full w-full">
        <div className="rounded-b-lg">
          {selectedTabUsersAndRoles.name === 'Users' ? (
            <consoleData.UsersTab />
          ) : (
            <consoleData.RoleTab />
          )}
        </div>
        <consoleData.UserSlidePanel />
      </common.Card>
    </>
  )
}
