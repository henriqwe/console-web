import * as common from 'common'
import * as consoleData from 'domains/console'
import * as utils from 'utils'
import { useEffect, useState } from 'react'
import { RowActions } from './RowActions'
import { CheckIcon, PlusIcon } from '@heroicons/react/outline'
import * as UserContext from 'contexts/UserContext'
import { useRouter } from 'next/router'
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form'

export function RoleTab() {
  const router = useRouter()
  const { user, setUser } = UserContext.useUser()
  const [loading, setLoading] = useState(true)
  const { selectedEntity } = consoleData.useSchemaManager()
  const { reload, setSlideType, setOpenSlide, setRoles, roles } =
    consoleData.useUser()
  const { control, handleSubmit, reset } = useForm()

  async function loadData() {
    try {
      const { data } = await utils.api.post(
        utils.apiRoutes.roles,
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
      setRoles(data)
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
      setRoles(undefined)
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
        <div className="w-full h-full  rounded-b-lg overflow-y">
          <div className="flex items-center justify-end w-full px-8 py-2">
            <common.Buttons.WhiteOutline
              type="button"
              onClick={() => {
                setOpenSlide(true)
                setSlideType('ROLE')
              }}
              icon={<PlusIcon className="w-5 h-5" />}
            >
              Create
            </common.Buttons.WhiteOutline>
          </div>
          <common.Table
            tableColumns={[
              { name: 'name', displayName: 'Name' },
              {
                name: 'status',
                displayName: 'Status',
                handler: (value) =>
                  value === 0
                    ? 'Suspended'
                    : value === 1
                    ? 'Active'
                    : 'Canceled'
              }
            ]}
            values={roles}
            actions={RowActions}
          />
        </div>
      )}
    </div>
  )
}
