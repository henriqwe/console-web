import * as utils from 'utils'
import * as common from 'common'
import * as consoleData from 'domains/console'

export function RowActions({ item }: { item: any }) {
  const { setReload, reload } = consoleData.useUser()
  const actions = [
    {
      title: 'excluir',
      handler: async () => {
        // event?.preventDefault()
        // await utils.api
        //   .delete(utils.apiRoutes.deleteRole(item.name), {
        //     headers: {
        //       Authorization: `Bearer${utils.getCookie('access_token')}`,
        //       'X-TenantID': utils.getCookie('X-TenantID') as string
        //     }
        //   })
        //   .then(() => {
        //     setReload(!reload)
        //     utils.notification('Operation performed successfully', 'success')
        //   })
        //   .catch((err) => {
        //     utils.notification(err.message, 'error')
        //   })
      },
      icon: (
        <common.icons.DeleteIcon className="!text-red-200 cursor-not-allowed" />
      )
    }
  ]
  return <common.ActionsRow actions={actions} />
}
