import * as utils from 'utils'
import * as services from 'services'
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
        try {
          await services.ycodify.deleteRole({
            password: user?.adminSchemaPassword as string,
            roleName: item.name,
            username: `${
              utils.parseJwt(utils.getCookie('access_token') as string)
                ?.username
            }@${router.query.name}`
          })
          setReload(!reload)
          utils.notification('Operation performed successfully', 'success')
        } catch (err: any) {
          utils.notification(err.message, 'error')
        }
      },
      icon: <common.icons.DeleteIcon />
    }
  ]
  return <common.ActionsRow actions={actions} />
}
