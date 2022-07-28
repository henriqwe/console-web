import * as common from 'common'
import * as consoleData from 'domains/console'
import * as utils from 'utils'
import { useEffect, useState } from 'react'
import { RowActions } from './RowActions'
import { PlusIcon } from '@heroicons/react/outline'

export function AccountTab() {
  const [loading, setLoading] = useState(true)
  const [tableData, setTableData] = useState()
  const { selectedTable } = consoleData.useData()
  const { reload, setOpenSlide, setSlideType } = consoleData.useUser()

  async function loadData() {
    try {
      const { data } = await utils.api.get(utils.apiRoutes.userAccount, {
        headers: {
          'X-TenantID': utils.getCookie('X-TenantID') as string,
          Accept: 'application/json',
          Authorization: `Bearer ${utils.getCookie('admin_access_token')}`
        }
      })
      setTableData(data)
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
    setTableData(undefined)
    setLoading(true)
    loadData()
  }, [selectedTable, reload])

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

          <p className="text-lg font-bold text-gray-700">Loading table data</p>
        </div>
      ) : (
        <div className="flex flex-col w-full h-full gap-0 bg-gray-100 rounded-b-lg overflow-y">
          <div className="flex items-center justify-between w-full px-8 pt-2">
            <h2 className="text-lg">Accounts</h2>
            <common.Buttons.Blue
              type="button"
              onClick={() => {
                setOpenSlide(true)
                setSlideType('ACCOUNT')
              }}
            >
              <PlusIcon className="w-5 h-5" />
            </common.Buttons.Blue>
          </div>
          <common.Separator />
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
                  roles.map(
                    (role, index) =>
                      `${role.name}${index + 1 === roles.length ? '' : ', '}`
                  )
              }
            ]}
            values={tableData}
            actions={RowActions}
          />
        </div>
      )}
    </div>
  )
}
