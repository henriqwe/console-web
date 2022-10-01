import * as common from 'common'
import * as consoleData from 'domains/console'
import * as utils from 'utils'
import { useEffect, useState } from 'react'
import { RowActions } from './RowActions'
import { PlusIcon } from '@heroicons/react/outline'

export function RoleTab() {
  const [loading, setLoading] = useState(true)
  const { selectedEntity } = consoleData.useSchemaManager()
  const { reload, setSlideType, setOpenSlide, setRoles, roles } =
    consoleData.useUser()

  async function loadData() {
    try {
      const { data } = await utils.api.get(utils.apiRoutes.roles, {
        headers: {
          'X-TenantID': utils.getCookie('X-TenantID') as string,
          Accept: 'application/json',
          Authorization: `Bearer ${utils.getCookie('access_token')}`
        }
      })
      setRoles(data)
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
    setRoles(undefined)
    setLoading(true)
    loadData()
  }, [selectedEntity, reload])

  return (
    <div
      className={`flex flex-col ${
        loading ? 'items-center justify-center' : 'items-start'
      } h-full bg-white rounded-b-lg`}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-20 h-20">
            <common.Spinner />
          </div>

          <p className="text-lg font-bold text-gray-700">Loading entity data</p>
        </div>
      ) : (
        <div className="w-full h-full bg-gray-100 rounded-b-lg overflow-y">
          <div className="flex items-center justify-between w-full px-8 pt-2">
            <h2 className="text-lg">Roles</h2>
            <common.Buttons.Blue
              type="button"
              onClick={() => {
                setOpenSlide(true)
                setSlideType('ROLE')
              }}
            >
              <PlusIcon className="w-5 h-5" />
            </common.Buttons.Blue>
          </div>
          {/* <common.Table
            tableColumns={[
              { name: 'name', displayName: 'Name' },
              { name: 'schema', displayName: 'Schema' },
              {
                name: 'defaultUse',
                displayName: 'Default use',
                handler: (value) => (value ? 'Yes' : 'No')
              },
              {
                name: 'status',
                displayName: 'Status',
                handler: (value) => (value === 1 ? 'Active' : 'Suspended')
              }
            ]}
            values={roles}
            actions={RowActions}
          /> */}
        </div>
      )}
    </div>
  )
}
