import * as utils from 'utils'
import * as common from 'common'
import * as consoleData from 'domains/console'
import axios from 'axios'
import { getCookie } from 'utils/cookies'

export function RowActions({ item }: { item: any }) {
  const {
    setOpenSlide,
    setSelectedItemToExclude,
    selectedTable,
    setReload,
    reload
  } = consoleData.useData()
  const actions = [
    {
      title: 'Update',
      handler: async () => {
        event?.preventDefault()
        setOpenSlide(true)
        setSelectedItemToExclude(item)
      },
      icon: <common.icons.EditIcon />
    },
    {
      title: 'Delete',
      handler: async () => {
        event?.preventDefault()
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/interpreter`,
            {
              data: JSON.parse(
                `{\n "action":"DELETE",\n "object":{\n "classUID": "${selectedTable}",\n "id": ${item.id},\n "role": "ROLE_ADMIN"\n }\n}`
              ),
              access_token: getCookie('admin_access_token')
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
      icon: <common.icons.DeleteIcon />
    }
  ]
  return <common.ActionsRow actions={actions} />
}
