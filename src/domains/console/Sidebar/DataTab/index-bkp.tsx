import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import * as common from 'common'
import * as utils from 'utils'
import * as consoleSection from 'domains/console'
import axios from 'axios'
import { getCookie } from 'utils/cookies'
import { useRouter } from 'next/router'
import { PlusIcon } from '@heroicons/react/outline'

export function DataTab() {
  const router = useRouter()
  const { selectedTable, setSelectedTable, reload, setShowCreateTableSection } =
    consoleSection.useData()
  const [tables, setTables] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  async function loadTables() {
    try {
      setLoading(true)

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/schema?schemaName=${router.query.name}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie('access_token')}`
          }
        }
      )
      setTables(Object.keys(data.data) as string[])
    } catch (err: any) {
      if (err.response.status !== 404) {
        utils.notification(err.message, 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (router.query.name) {
      loadTables()
    }
  }, [router.query.name, reload])

  return (
    <div className="flex flex-col h-full px-6 pt-4 overflow-y-auto rounded-b-lg">
      <div>
        <div className="flex items-center justify-center w-full">
          <button
            className="px-2 py-2"
            data-tour="step-2"
            onClick={() => {
              setShowCreateTableSection(true)
            }}
          >
            <div className="flex items-center gap-2">
              <p className="text-xs">Create entity</p>
              <PlusIcon className="w-3 h-3" />
            </div>
          </button>
        </div>
        <common.Separator />
        {loading ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className="w-8 h-8 mr-8">
              <common.Spinner />
            </div>
            <div>Loading...</div>
          </div>
        ) : tables.length === 0 ? (
          <div>
            <p>Entities not found</p>
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
                  setShowCreateTableSection(false)
                }}
              >
                <Icon icon="bi:table" className="w-4 h-4" />
                <p className="text-sm">{table}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
