import * as utils from 'utils'
import * as common from 'common'
import * as consoleData from 'domains/console'
import axios from 'axios'

export function RowActions({ item }: { item: any }) {
  const { setReload, reload, setOpenSlide, setSlideType, setSelectedUser } =
    consoleData.useUser()
  const actions = [
    {
      title: 'Update',
      handler: async () => {
        event?.preventDefault()
        setOpenSlide(true)
        setSlideType('UPDATEACCOUNT')
        setSelectedUser(item)
      },
      icon: <common.icons.EditIcon />
    },
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
