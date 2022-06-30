import * as common from 'common'
import * as consoleData from 'domains/console'
import * as utils from 'utils'
import axios from 'axios'
import { useEffect, useState } from 'react'

export function RoleTab() {
  const [loading, setLoading] = useState(true)
  const [tableData, setTableData] = useState()
  const { selectedTable } = consoleData.useData()

  async function loadData() {
    try {
      const { data } = await axios.get(
        `https://api.ycodify.com/api/caccount/role`,
        {
          headers: {
            'X-TenantID': utils.getCookie('X-TenantID') as string,
            Accept: 'application/json',
            Authorization: `Bearer ${utils.getCookie('admin_access_token')}`
          }
        }
      )
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
  }, [selectedTable])

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
        <div className="w-full h-full bg-gray-100 overflow-y">
          <common.Table
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
                handler: (value) => (value === 1 ? 'Active' : 'Not Active')
              }
            ]}
            values={tableData}
          />
        </div>
      )}
    </div>
  )
}