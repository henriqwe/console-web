import * as consoleData from 'domains/console'
import * as common from 'common'
import { CreateRole } from './CreateRole'
import { CreateAccount } from './CreateAccount'
import { UpdateAccount } from './UpdateAccount'
import { AdminLogin } from './AdminLogin'
import { AssociateAccount } from './AssociateAccount'
import { UpdateRole } from './UpdateRole'

export function UserSlidePanel() {
  const { setOpenSlide, openSlide, slideType } = consoleData.useUser()

  let title = ''
  let content = <div />
  switch (slideType) {
    case 'ACCOUNT':
      title = 'Create Account'
      content = <CreateAccount />
      break
    case 'ASSOCIATEACCOUNT':
      title = 'Associate Account'
      content = <AssociateAccount />
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
    case 'UPDATEROLE':
      title = 'Update role'
      content = <UpdateRole />
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
