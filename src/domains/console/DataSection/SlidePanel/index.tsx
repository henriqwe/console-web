import * as consoleData from 'domains/console'
import * as common from 'common'
import { Update } from './Update'

export function SlidePanel() {
  const { setOpenSlide, openSlide } = consoleData.useData()
  return (
    <common.Slide
      title={'Update register'}
      open={openSlide}
      setOpen={setOpenSlide}
      content={<Update />}
    />
  )
}
