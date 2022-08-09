import * as dashboard from 'domains/dashboard'
import * as common from 'common'
import { Create } from './CreateProject'
import { ViewSchema } from './ViewProject'

export function SlidePanel() {
  const { setOpenSlide, openSlide, slideType, selectedSchema, slideSize } =
    dashboard.useData()
  return (
    <common.Slide
      title={
        slideType === 'CREATE'
          ? 'Create schema'
          : (selectedSchema?.name as string)
      }
      open={openSlide}
      slideSize={slideSize}
      setOpen={setOpenSlide}
      content={slideType === 'CREATE' ? <Create /> : <ViewSchema />}
    />
  )
}
