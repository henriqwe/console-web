import * as utils from 'utils'
import * as common from 'common'
import * as consoleData from 'domains/console'

export function RowActions({ item }: { item: any }) {
  const { setSlideType, setOpenSlide, setSlideData } = consoleData.useUser()
  const actions = [
    {
      title: 'edit',
      handler: async () => {
        setSlideData(item)
        setOpenSlide(true)
        setSlideType(`UPDATEROLE`)
      },
      icon: <common.icons.EditIcon />
    }
  ]
  return <common.ActionsRow actions={actions} />
}
