import * as utils from 'utils'
import * as common from 'common'
import * as consoleData from 'domains/console'
import axios from 'axios'

export function RowActions({ item }: { item: any }) {
  const { setSlidePanelState, selectedTable, setReload, reload } = consoleData.useData()
  const actions = [
    {
      title: 'Update',
      handler: async () => {
        event?.preventDefault()
        setSlidePanelState({
          open: true,
          type: 'update',
          data: item
        })
      },
      icon: <common.icons.EditIcon/>
    },
    {
      title: 'Delete',
      handler: async () => {
        event?.preventDefault()
        await axios
          .post(
            `http://localhost:3000/api/interpreter`,
            {
              data: JSON.parse(
                `{\n "action":"DELETE",\n "object":{\n "classUID": "${selectedTable}",\n "id": ${item.id},\n "role": "ROLE_ADMIN"\n }\n}`
              )
            },
            {
              headers: {
                Authorization: `Bearer ${utils.getCookie('access_token')}`
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
      icon: <common.icons.DeleteIcon/>
    }
  ]
  return <common.ActionsRow actions={actions} />
}
