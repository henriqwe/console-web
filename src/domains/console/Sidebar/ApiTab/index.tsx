import { Icon } from '@iconify/react'
import { SetStateAction, useEffect, useState } from 'react'
import * as common from 'common'
import axios from 'axios'
import { getCookie } from 'utils/cookies'
import * as consoleEditor from '../../ConsoleEditorContext'
import { useRouter } from 'next/router'

export function ApiTab() {
  const router = useRouter()
  const [operations, setOperations] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTable, setActiveTable] = useState<string>()
  const { formatQueryOrMutation } = consoleEditor.useConsoleEditor()

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
          `http://localhost:3000/api/schema?schemaName=${router.query.name}`,
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
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-8 h-8 mr-8">
            <common.Spinner />
          </div>
          <div>Loading...</div>
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
  return (
    <div className="flex flex-col gap-2 px-3">
      <div
        className={`flex items-center gap-2 pb-2 cursor-pointer`}
        onClick={() => {
          setActive(!active)
        }}
      >
        <Icon icon="bxs:right-arrow" className={`w-4 h-4 transition ${active && 'rotate-90'}`} />
        <p className="text-sm">{schema}</p>
      </div>
      {active &&
        ['insert', 'update', 'delete', 'select', 'select by pk'].map(
          (table) => (
            <div key={table}>
              <div
                className={`flex items-center gap-2 pb-2 ml-8 cursor-pointer ${
                  activeTable === `${schema}${table}` && 'text-orange-400'
                }`}
                onClick={() => {
                  setActiveTable(`${schema}${table}`)
                  formatQueryOrMutation(table, schema)
                }}
              >
                <p className="text-sm">{table}</p>
              </div>
            </div>
          )
        )}
    </div>
  )
}
