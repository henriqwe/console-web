import * as common from 'common'
import * as consoleData from 'domains/console'
import * as utils from 'utils'
import * as services from 'services'
import { useEffect, useState } from 'react'
import { RowActions } from './RowActions'
import { CheckIcon, LinkIcon, PlusIcon } from '@heroicons/react/outline'
import * as UserContext from 'contexts/UserContext'
import { useRouter } from 'next/router'

type userDataType = {
  email: string
  id: number
  logCreatedAt: number
  logUpdatedAt: number
  logVersion: number
  name: string
  roles: { name: string }[]
  status: number
  username: string
}

export function UsersTab() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [usersData, setUsersData] = useState<userDataType[]>([])
  const { selectedEntity } = consoleData.useSchemaManager()
  const { reload, setOpenSlide, setSlideType } = consoleData.useUser()
  const { user, setUser } = UserContext.useUser()

  async function loadData() {
    try {
      const { data } = await services.ycodify.getAdminData({
        password: user?.adminSchemaPassword as string,
        username: `${
          utils.parseJwt(utils.getCookie('access_token') as string)?.username
        }@${router.query.name}`
      })
      setUsersData(data)
    } catch (err: any) {
      setUser({ ...user, adminSchemaPassword: undefined })
      if (err.response.status === 401 || err.response.status === 400) {
        return
      }
      if (err.response.status !== 404) {
        utils.notification(err.message, 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.adminSchemaPassword) {
      setUsersData([])
      setLoading(true)
      loadData()
    }
  }, [selectedEntity, reload, user?.adminSchemaPassword])

  if (!user?.adminSchemaPassword) {
    return (
      <div className="flex  p-8 justify-between ">
        You need admin authorization to access this section
        <common.Buttons.WhiteOutline
          icon={<CheckIcon className="w-3 h-3" />}
          onClick={() => {
            setOpenSlide(true)
            setSlideType('ADMINLOGIN')
          }}
        >
          Authorization
        </common.Buttons.WhiteOutline>
      </div>
    )
  }
  return (
    <div
      className={`users-step-1 flex flex-col ${
        loading ? 'items-center justify-center' : 'items-start'
      } h-full  rounded-b-lg`}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-20 h-20">
            <common.Spinner />
          </div>

          <p className="text-lg font-bold text-gray-700 dark:text-text-secondary">
            Loading entity data
          </p>
        </div>
      ) : (
        <div className="flex flex-col w-full h-full gap-2  rounded-b-lg pt-2">
          <div className="flex items-center w-full px-4 py-2 gap-8 ">
            <common.Buttons.WhiteOutline
              type="button"
              onClick={() => {
                setOpenSlide(true)
                setSlideType('ASSOCIATEACCOUNT')
              }}
              icon={<LinkIcon className="w-5 h-5" />}
              className="users-step-3"
            >
              Associate
            </common.Buttons.WhiteOutline>
            <common.Buttons.WhiteOutline
              type="button"
              onClick={() => {
                setOpenSlide(true)
                setSlideType('ACCOUNT')
              }}
              icon={<PlusIcon className="w-5 h-5" />}
              className="users-step-2"
            >
              Create
            </common.Buttons.WhiteOutline>
          </div>
          <common.Table
            tableColumns={[
              { name: 'username', displayName: 'Username' },
              {
                name: 'email',
                displayName: 'Email',
                handler: (value) => (value ? value : undefined)
              },
              {
                name: 'status',
                displayName: 'Status',
                handler: (value) => (value === 1 ? 'Active' : 'Not Active')
              },
              {
                name: 'roles',
                displayName: 'Roles',
                handler: (roles: { name: string }[]) =>
                  roles?.map(
                    (role, index) =>
                      `${role.name}${index + 1 === roles.length ? '' : ', '}`
                  )
              }
            ]}
            values={usersData}
            actions={RowActions}
          />
        </div>
      )}
    </div>
  )
}
