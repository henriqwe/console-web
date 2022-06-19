import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import * as common from 'common'
import * as data from 'domains/console'
import axios from 'axios'
import { getCookie } from 'utils/cookies'

export function ApiTab() {
  const [operations, setOperations] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTable, setActiveTable] = useState<string>()

  async function loadOperations() {
    const operations = []
    setLoading(true)
    const { data } = await axios.get('http://localhost:3000/api/schemas', {
      headers: {
        Authorization: `Bearer ${getCookie('access_token')}`
      }
    })
    for (const schema of data.data) {
      if (schema === 'academia') {
        const { data: tables } = await axios.get(
          `http://localhost:3000/api/schema?schemaName=${schema}`,
          {
            headers: {
              Authorization: `Bearer ${getCookie('access_token')}`
            }
          }
        )
        for (const table of Object.keys(tables.data)) {
          operations.push(`${table}`)
        }
      }
    }
    setOperations(operations)
    setLoading(false)
  }

  useEffect(() => {
    loadOperations()
  }, [])

  return (
    <div className="flex-1 h-full px-6 pt-4 overflow-y-auto bg-gray-100 rounded-b-lg">
      {loading ? (
        <div className="flex h-full w-full justify-center items-center">
          <div className="w-8 h-8 mr-8">
            <common.Spinner />
          </div>
          <div>Loading...</div>
        </div>
      ) : (
        operations.map((schema) => (
          <div key={schema} className="flex flex-col gap-2 px-3">
            <div
              className={`flex items-center gap-2 pb-2 cursor-pointer`}
              onClick={() => {}}
            >
              <Icon icon="bxs:right-arrow" className={`w-4 h-4 transition`} />
              <p className="text-sm">{schema}</p>
            </div>
            {['insert', 'update', 'delete', 'select', 'select by pk'].map(
              (table) => (
                <div key={table}>
                  <div
                    className={`flex items-center gap-2 pb-2 ml-8 cursor-pointer ${
                      activeTable === `${schema}${table}` && 'text-orange-400'
                    }`}
                    onClick={() => {
                      setActiveTable(`${schema}${table}`)
                    }}
                  >
                    <p className="text-sm">{table}</p>
                  </div>
                </div>
              )
            )}
          </div>
        ))
      )}
    </div>
  )
}
