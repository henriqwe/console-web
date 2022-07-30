import { Icon } from '@iconify/react'
import { SetStateAction, useEffect, useState } from 'react'
import * as consoleSection from 'domains/console'
import * as common from 'common'
import * as utils from 'utils'
import { getCookie } from 'utils/cookies'
import * as consoleEditor from '../../ConsoleEditorContext'
import { useRouter } from 'next/router'
import { CheckIcon, DatabaseIcon } from '@heroicons/react/outline'

export function ApiTab() {
  const router = useRouter()
  const [operations, setOperations] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTable, setActiveTable] = useState<string>()
  const { formatQueryOrMutation } = consoleEditor.useConsoleEditor()

  async function loadOperations() {
    try {
      const operations = []
      setLoading(true)

      const response = await utils.api
        .get(`${utils.apiRoutes.entityList(router.query.name as string)}`, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        })
        .catch(() => null)
      console.log(response!.data)
      for (const table of Object.keys(response!.data)) {
        operations.push(`${table}`)
      }
      setOperations(operations)
    } catch (err: any) {
      if (err?.response?.status !== 404) {
        utils.notification(err.message, 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (router.query.name) {
      loadOperations()
    }
  }, [router.query.name])

  return (
    <div className="flex-1 h-full pt-4 overflow-y-auto rounded-b-lg">
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-8 h-8 mr-8">
            <common.Spinner />
          </div>
          <div>Loading...</div>
        </div>
      ) : operations.length === 0 ? (
        <div>
          <p>Operations not found</p>
        </div>
      ) : (
        operations.map((schema) => (
          <Operation
            key={schema}
            schema={schema}
            activeTable={activeTable}
            formatQueryOrMutation={formatQueryOrMutation}
            setActiveTable={setActiveTable}
          />
        ))
      )}
    </div>
  )
}

function Operation({
  schema,
  activeTable,
  formatQueryOrMutation,
  setActiveTable
}: {
  schema: string
  activeTable: string | undefined
  formatQueryOrMutation: (type: string, entity: string) => void
  setActiveTable: (value: SetStateAction<string | undefined>) => void
}) {
  const [active, setActive] = useState(false)

  const { setSelectedTab } = consoleSection.useSidebar()
  const { setCurrentTab, setSelectedTable } = consoleSection.useData()

  return (
    <div className="flex flex-col gap-2 px-3 mb-2">
      <div
        className={`flex items-center gap-2 cursor-pointer justify-between`}
        onClick={() => {
          setActive(!active)
        }}
      >
        <div className="flex items-center gap-2">
          <Icon
            icon="bx:chevron-right"
            className={`w-4 h-4 transition ${active && 'rotate-90'}`}
          />
          <p className="text-sm">{schema}</p>
        </div>
      </div>
      {active &&
        ['insert', 'update', 'delete', 'select', 'select by pk'].map(
          (table) => (
            <div key={table}>
              <div
                className={`flex items-center gap-2  ml-4 cursor-pointer ${
                  activeTable === `${schema}${table}` && 'text-orange-400'
                }`}
                onClick={() => {
                  setActiveTable(`${schema}${table}`)
                  formatQueryOrMutation(table, schema)
                }}
              >
                <div className="w-4 h-4">
                  {activeTable === `${schema}${table}` && <CheckIcon />}
                </div>

                <p className="text-sm">{table}</p>
              </div>
            </div>
          )
        )}
    </div>
  )
}
