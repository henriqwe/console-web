import * as consoleData from 'domains/console'
import * as common from 'common'
import { CreateRole } from './CreateRole'
import { CreateAccount } from './CreateAccount'
import { UpdateAccount } from './UpdateAccount'
import { AdminLogin } from './AdminLogin'

export function UserSlidePanel() {
  const { setOpenSlide, openSlide, slideType } = consoleData.useUser()

  let title = ''
  let content = <div />
  switch (slideType) {
    case 'ACCOUNT':
      title = 'Create Account'
      content = <CreateAccount />
      break
    case 'ROLE':
      title = 'Create Role'
      content = <CreateRole />
      break
    case 'ADMINLOGIN':
      title = 'Authorization'
      content = <AdminLogin />
      break
    case 'UPDATEACCOUNT':
      title = 'Update Account'
      content = <UpdateAccount />
      break
  }

  return (
    <common.Slide
      title={title}
      open={openSlide}
      setOpen={setOpenSlide}
      content={content}
    />
  )
}
