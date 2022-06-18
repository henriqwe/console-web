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
    const { data } = await axios.get('http://localhost:3000/api/schemas', {
      headers: {
        Authorization: `Bearer ${getCookie('access_token')}`
      }
    })
    for (const schema of data.data) {
      const { data: tables } = await axios.get(
        `http://localhost:3000/api/schema?schemaName=${schema}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie('access_token')}`
          }
        }
      )
      for (const table of Object.keys(tables.data)) {
        operations.push(`${schema}_${table}`)
      }
    }
    setOperations(operations)
  }

  useEffect(() => {
    loadOperations()
  }, [])

  return (
    <div className="flex-1 h-full px-2 mx-2 mb-5 overflow-y-auto ">
      {loading ? (
        <div className="w-5 h-5 ml-8">
          <common.Spinner />
        </div>
      ) : (
        operations.map((schema) => (
          <div key={schema}>
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
