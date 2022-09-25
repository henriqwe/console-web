import * as dashboard from 'domains/dashboard'
import * as common from 'common'
import { Create } from './CreateProject'
import { CreateTicket } from './CreateTicket'
import { ViewSchema } from './ViewProject'

export function SlidePanel() {
  const { setOpenSlide, openSlide, slideType, selectedSchema, slideSize } =
    dashboard.useData()

  let component = <div />
  let title = ''
  switch (slideType) {
    case 'createProject':
      component = <Create />
      title = 'New Project'
      break
    case 'viewProject':
      component = <ViewSchema />
      title = selectedSchema?.name as string
      break
    case 'createTicket':
      component = <CreateTicket />
      title = 'New ticket'
      break
  }
  return (
    <common.Slide
      title={title}
      open={openSlide}
      slideSize={slideSize}
      setOpen={setOpenSlide}
      content={component}
    />
  )
}
