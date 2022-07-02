import * as utils from 'utils'
import * as common from 'common'
import * as consoleData from 'domains/console'
import axios from 'axios'

export function RowActions({ item }: { item: any }) {
  const { setReload, reload } = consoleData.useUser()
  const actions = [
    {
      title: 'Delete',
      handler: async () => {
        event?.preventDefault()
        await axios
          .delete(
            `https://api.ycodify.com/api/caccount/account/username/${item.username}/version/${item.version}`,
            {
              headers: {
                Authorization: `Bearer ${utils.getCookie(
                  'admin_access_token'
                )}`,
                'X-TenantID': utils.getCookie('X-TenantID') as string
              }
            }
          )
          .then(() => {
            setReload(!reload)
            utils.notification('Operation performed successfully', 'success')
          })
          .catch((err) => {
            utils.notification(err.message, 'error')
          })
      },
      icon: <common.icons.DeleteIcon />
    }
  ]
  return <common.ActionsRow actions={actions} />
}
