import { Icon } from '@iconify/react'
import { SetStateAction, useEffect, useState } from 'react'
import * as consoleSection from 'domains/console'
import * as common from 'common'
import * as utils from 'utils'
import axios from 'axios'
import { getCookie } from 'utils/cookies'
import * as consoleEditor from '../../ConsoleEditorContext'
import { useRouter } from 'next/router'
import { CheckIcon, DatabaseIcon } from '@heroicons/react/outline'

export function ApiTab() {
  const router = useRouter()
  const [operations, setOperations] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [activeEntity, setActiveEntity] = useState<string>()
  const { formatQueryOrMutation } = consoleEditor.useConsoleEditor()

  async function loadOperations() {
    try {
      const operations = []
      setLoading(true)

      const { data: entities } = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/schema?schemaName=${router.query.name}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie('access_token')}`
          }
        }
      )
      for (const entity of Object.keys(entities.data)) {
        operations.push(`${entity}`)
      }
      setOperations(operations)
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
      loadOperations()
    }
  }, [router.query.name])

  return (
    <div className="flex-1 h-full pt-2  px-4 overflow-y-auto rounded-b-lg">
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
            activeEntity={activeEntity}
            formatQueryOrMutation={formatQueryOrMutation}
            setActiveEntity={setActiveEntity}
          />
        ))
      )}
    </div>
  )
}

function Operation({
  schema,
  activeEntity,
  formatQueryOrMutation,
  setActiveEntity
}: {
  schema: string
  activeEntity: string | undefined
  formatQueryOrMutation: (type: string, entity: string) => void
  setActiveEntity: (value: SetStateAction<string | undefined>) => void
}) {
  const [active, setActive] = useState(false)

  const { setSelectedTab } = consoleSection.useSidebar()
  const { setCurrentTab, setSelectedEntity } = consoleSection.useData()

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
          (entity) => (
            <div key={entity}>
              <div
                className={`flex items-center gap-2  ml-4 cursor-pointer ${
                  activeEntity === `${schema}${entity}` && 'text-orange-400'
                }`}
                onClick={() => {
                  setActiveEntity(`${schema}${entity}`)
                  formatQueryOrMutation(entity, schema)
                }}
              >
                <div className="w-4 h-4">
                  {activeEntity === `${schema}${entity}` && <CheckIcon />}
                </div>

                <p className="text-sm">{entity}</p>
              </div>
            </div>
          )
        )}
    </div>
  )
}
