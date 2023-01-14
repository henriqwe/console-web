import * as consoleData from 'domains/console'
import * as common from 'common'
import { UpdateEntityName } from './UpdateEntityName'

export function SlidePanel() {
  const { setOpenSlide, openSlide } = consoleData.useSchemaManager()
  return (
    <common.Slide
      title={'Update entity name'}
      open={openSlide}
      setOpen={setOpenSlide}
      content={<UpdateEntityName />}
    />
  )
}
