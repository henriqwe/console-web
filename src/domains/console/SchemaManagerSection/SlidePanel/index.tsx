import * as consoleData from 'domains/console'
import * as common from 'common'
import { Update } from './Update'
import { UpdateEntityName } from './UpdateEntityName'

export function SlidePanel() {
  const { setOpenSlide, openSlide, slideType } = consoleData.useSchemaManager()
  return (
    <common.Slide
      title={slideType === 'UPDATE' ? 'Update register' : 'Update entity name'}
      open={openSlide}
      setOpen={setOpenSlide}
      content={slideType === 'UPDATE' ? <Update /> : <UpdateEntityName />}
    />
  )
}
