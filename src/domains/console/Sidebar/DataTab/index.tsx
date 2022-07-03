import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import * as common from 'common'
import * as consoleSection from 'domains/console'
import axios from 'axios'
import { getCookie } from 'utils/cookies'
import { useRouter } from 'next/router'

export function DataTab() {
  const router = useRouter()
  const { selectedTable, setSelectedTable, reload, setShowCreateTableSection } =
    consoleSection.useData()
  const [tables, setTables] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  async function loadTables() {
    setLoading(true)

    const { data } = await axios.get(
      `http://localhost:3000/api/schema?schemaName=${router.query.name}`,
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
    if (router.query.name) {
      loadTables()
    }
  }, [router.query.name, reload])

  return (
    <div className="flex flex-col h-full px-6 pt-2 overflow-y-auto bg-gray-100 rounded-b-lg">
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-8 h-8 mr-8">
            <common.Spinner />
          </div>
          <div>Loading...</div>
        </div>
      ) : (
        <div>
          <div className="w-full mb-2">
            <common.Button
              color="green"
              className="w-full"
              onClick={() => setShowCreateTableSection(true)}
            >
              Create entity
            </common.Button>
          </div>
          <common.Separator />
          {tables.map((table) => (
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
          ))}
        </div>
      )}
    </div>
  )
}
