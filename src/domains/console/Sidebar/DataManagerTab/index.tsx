import { Icon } from '@iconify/react'
import { SetStateAction, useEffect, useState } from 'react'
import * as common from 'common'
import * as utils from 'utils'
import * as consoleEditor from '../../ConsoleEditorContext'
import { useRouter } from 'next/router'
import { CheckIcon } from '@heroicons/react/outline'

export function DataManagerTab() {
  const router = useRouter()
  const [operations, setOperations] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [activeEntity, setActiveEntity] = useState<string>()
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

      for (const table of Object.keys(response!.data)) {
        operations.push(`${table}`)
      }
      setOperations(operations)
    } catch (err: any) {
      if (err?.response?.status !== 404) {
        utils.showError(err)
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
    <div className="flex-1 h-full gap-1 px-4 pt-3 overflow-y-auto rounded-b-lg">
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-8 h-8 mr-8">
            <common.Spinner />
          </div>
          <div>Loading...</div>
        </div>
      ) : operations.length === 0 ? (
        <div>
          <p className="font-extralight">Operations not found</p>
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

  return (
    <div className="flex flex-col gap-2 mb-2 ">
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
          <p className="text-sm font-light">{schema}</p>
        </div>
      </div>
      {active &&
        ['insert', 'update', 'delete', 'select', 'select by pk'].map(
          (entity) => (
            <div key={entity}>
              <div
                className={`flex items-center gap-2  ml-2 cursor-pointer ${
                  activeEntity === `${schema}${entity}` && 'text-text-highlight'
                }`}
                onClick={() => {
                  setActiveEntity(`${schema}${entity}`)
                  formatQueryOrMutation(entity, schema)
                }}
              >
                <div className="w-4 h-4">
                  {activeEntity === `${schema}${entity}` && <CheckIcon />}
                </div>

                <p className="text-sm font-extralight">{entity}</p>
              </div>
            </div>
          )
        )}
    </div>
  )
}
