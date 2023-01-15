import * as utils from 'utils'
import * as common from 'common'
import * as dashboard from 'domains/dashboard'

export function RowActions({ item }: { item: any }) {
  const { setSelectedTicket } =
    dashboard.useData()
  const actions = [
    {
      title: 'View',
      handler: async () => {
        event?.preventDefault()
        setSelectedTicket(item)
      },
      icon: <common.icons.ViewIcon />
    }
    // {
    //   title: 'Delete',
    //   handler: async () => {
    //     event?.preventDefault()
    //     await utils.api
    //       .delete(
    //         utils.apiRoutes.deleteUserAccount({
    //           username: item.username,
    //           version: item.version
    //         }),
    //         {
    //           headers: {
    //             Authorization: `Bearer ${utils.getCookie(
    //               'admin_access_token'
    //             )}`,
    //             'X-TenantID': utils.getCookie('X-TenantID') as string
    //           }
    //         }
    //       )
    //       .then(() => {
    //         setReload(!reload)
    //         utils.notification('Operation performed successfully', 'success')
    //       })
    //       .catch((err) => {
    //         utils.notification(err.message, 'error')
    //       })
    //   },
    //   icon: <common.icons.DeleteIcon />
    // }
  ]
  return <common.ActionsRow actions={actions} />
}
