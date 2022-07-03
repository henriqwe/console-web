import * as consoleData from 'domains/console'
import * as common from 'common'
import { CreateRole } from './CreateRole'
import { CreateAccount } from './CreateAccount'

export function UserSlidePanel() {
  const { setOpenSlide, openSlide, slideType } = consoleData.useUser()
  return (
    <common.Slide
      title={slideType === 'ROLE' ? 'Create Role' : 'Create Account'}
      open={openSlide}
      setOpen={setOpenSlide}
      content={slideType === 'ROLE' ? <CreateRole /> : <CreateAccount />}
    />
  )
}
