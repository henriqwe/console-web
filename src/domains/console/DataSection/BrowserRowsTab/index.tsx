import * as common from 'common'
import * as consoleData from 'domains/console'
import * as utils from 'utils'
import axios from 'axios'
import { useEffect, useState } from 'react'

type BrowserRowsProps = {
  tableFields: string[]
}

export function BrowserRowsTab({ tableFields }: BrowserRowsProps) {
  const [loading, setLoading] = useState(true)
  const [tableData, setTableData] = useState()
  const { selectedTable } = consoleData.useData()
  async function loadData() {
    try {
      const { data } = await axios.post(
        `http://localhost:3000/api/interpreter`,
        {
          data: JSON.parse(
            `{\n "action":"READ",\n "object":{\n   "classUID": "${selectedTable}",\n   "_role": "ROLE_ADMIN"\n }\n}`
          )
        },
        {
          headers: {
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        }
      )
      setTableData(data.data)
    } catch (err: any) {
      utils.notification(err.message, 'error')
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
          <common.Table tableColumns={tableFields} values={tableData} />
        </div>
      )}
    </div>
  )
}
