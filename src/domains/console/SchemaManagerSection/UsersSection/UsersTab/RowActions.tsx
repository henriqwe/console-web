import * as common from 'common'
import * as consoleData from 'domains/console'

export function RowActions({ item }: { item: any }) {
  const { setOpenSlide, setSlideType, setSelectedUser } =
    consoleData.useUser()
  const actions = [
    {
      title: 'Update',
      handler: () => {
        setOpenSlide(true)
        setSlideType('UPDATEACCOUNT')
        setSelectedUser(item)
      },
      icon: <common.icons.EditIcon data-testid="update"/>
    }
  ]
  return <common.ActionsRow actions={actions} />
}
