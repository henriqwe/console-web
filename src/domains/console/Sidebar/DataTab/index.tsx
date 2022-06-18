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
    <div className="px-6 mt-10">
      {loading ? (
        <div className="w-5 h-5 ml-8">
          <common.Spinner />
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
