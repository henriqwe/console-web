import * as utils from 'utils'
import * as common from 'common'
import * as consoleData from 'domains/console'

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
    }
  ]
  return <common.ActionsRow actions={actions} />
}
