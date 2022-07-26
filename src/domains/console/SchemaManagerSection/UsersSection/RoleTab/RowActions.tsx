import * as utils from 'utils'
import * as common from 'common'
import * as consoleData from 'domains/console'
import { useRouter } from 'next/router'
import * as UserContext from 'contexts/UserContext'

export function RowActions({ item }: { item: any }) {
  const { setReload, reload, setSlideType, setOpenSlide, setSlideData } =
    consoleData.useUser()
  const router = useRouter()
  const { user } = UserContext.useUser()

  const actions = [
    {
      title: 'Update',
      handler: async () => {
        setSlideData(item)
        setOpenSlide(true)
        setSlideType(`UPDATEROLE`)
      },
      icon: <common.icons.EditIcon />
    },
    {
      title: 'Delete',
      handler: async () => {
        event?.preventDefault()
        await utils.api
          .post(
            utils.apiRoutes.deleteRole,
            {
              username: `${
                utils.parseJwt(utils.getCookie('access_token'))?.username
              }@${router.query.name}`,
              password: user?.adminSchemaPassword,
              role: {
                name: item.name
              }
            },
            {
              headers: {
                'Content-Type': 'application/json'
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
