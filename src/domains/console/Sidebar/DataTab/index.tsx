import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import * as common from 'common'
import * as data from 'domains/console'
import axios from 'axios'
import { getCookie } from 'utils/cookies'

export function DataTab() {
  const [tables, setTables] = useState<string[]>([])
  const [activeSchema, setActiveSchema] = useState<string>()
  const [schemas, setSchemas] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTable, setActiveTable] = useState<string>()

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
  }, [activeSchema])

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
                activeTable === `${table}` && 'text-orange-400'
              }`}
              onClick={() => {
                setActiveTable(`${table}`)
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
