import * as common from 'common'
import * as consoleData from 'domains/console'
import * as SchemaManagerContext from 'domains/console'

export function UsersSection() {
  const { selectedTabUsersAndRoles } = SchemaManagerContext.useSchemaManager()

  return (
    <common.Card className="flex flex-col h-full w-full">
      <div className="rounded-b-lg">
        {selectedTabUsersAndRoles.name === 'Accounts' ? (
          <consoleData.AccountTab />
        ) : (
          <consoleData.RoleTab />
        )}
      </div>
      <consoleData.UserSlidePanel />
    </common.Card>
  )
}
