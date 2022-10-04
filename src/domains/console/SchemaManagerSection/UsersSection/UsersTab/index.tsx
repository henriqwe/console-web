import * as common from 'common'
import * as consoleData from 'domains/console'
import * as utils from 'utils'
import { useEffect, useState } from 'react'
import { RowActions } from './RowActions'
import { CheckIcon, LinkIcon, PlusIcon } from '@heroicons/react/outline'
import * as UserContext from 'contexts/UserContext'
import { useRouter } from 'next/router'

export function UsersTab() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [entityData, setEntityData] = useState()
  const { selectedEntity } = consoleData.useSchemaManager()
  const { reload, setOpenSlide, setSlideType } = consoleData.useUser()
  const { user } = UserContext.useUser()

  async function loadData() {
    try {
      const { data } = await utils.api.post(
        utils.apiRoutes.userAccount,
        {
          username: `${
            utils.parseJwt(utils.getCookie('access_token'))?.username
          }@${router.query.name}`,
          password: user?.adminSchemaPassword
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      setEntityData(data)
    } catch (err: any) {
      console.log(err)
      if (err.response.status !== 404) {
        utils.notification(err.message, 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.adminSchemaPassword) {
      setEntityData(undefined)
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
      className={`flex flex-col ${
        loading ? 'items-center justify-center' : 'items-start'
      } h-full  rounded-b-lg`}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-20 h-20">
            <common.Spinner />
          </div>

          <p className="text-lg font-bold text-gray-700">Loading entity data</p>
        </div>
      ) : (
        <div className="flex flex-col w-full h-full gap-2  rounded-b-lg ">
          <div className="flex items-center justify-end w-full px-8 py-2 gap-8">
            <common.Buttons.WhiteOutline
              type="button"
              onClick={() => {
                setOpenSlide(true)
                setSlideType('ASSOCIATEACCOUNT')
              }}
              icon={<LinkIcon className="w-5 h-5" />}
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
            values={entityData}
            actions={RowActions}
          />
        </div>
      )}
    </div>
  )
}
