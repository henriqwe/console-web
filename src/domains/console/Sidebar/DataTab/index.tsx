import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import * as common from 'common'
import * as consoleSection from 'domains/console'
import axios from 'axios'
import { getCookie } from 'utils/cookies'

export function DataTab() {
  const { selectedTable, setSelectedTable } = consoleSection.useData()
  const [tables, setTables] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  async function loadTables() {
    setLoading(true)

    const { data } = await axios.get(
      `http://localhost:3000/api/schema?schemaName=${'academia'}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie('access_token')}`
        }
      }
    )
    setTables(Object.keys(data.data) as string[])
    setLoading(false)
  }

  useEffect(() => {
    loadTables()
  }, [])

  return (
    <div className="flex flex-col h-full px-6 pt-2 overflow-y-auto bg-gray-100 rounded-b-lg">
      {loading ? (
        <div className="flex h-full w-full justify-center items-center">
          <div className="w-8 h-8 mr-8">
            <common.Spinner />
          </div>
          <div>Loading...</div>
        </div>
      ) : (
        tables.map((table) => (
          <div key={table}>
            <div
              className={`flex items-center gap-2 pb-2 cursor-pointer ${
                selectedTable === `${table}` && 'text-orange-400'
              }`}
              onClick={() => {
                setSelectedTable(`${table}`)
              }}
            >
              <Icon icon="bi:table" className="w-4 h-4" />
              <p className="text-sm">{table}</p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
