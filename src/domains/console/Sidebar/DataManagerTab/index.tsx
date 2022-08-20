import { Icon } from '@iconify/react'
import { SetStateAction, useEffect, useState } from 'react'
import * as common from 'common'
import * as utils from 'utils'
import * as consoleEditor from 'domains/console/ConsoleEditorContext'
import { useRouter } from 'next/router'
import { CheckIcon } from '@heroicons/react/outline'
import type {
  attributesType,
  handleFormatQueryOrMutationEntityType
} from 'domains/console/ConsoleEditorContext'

type schemaEntitiesType = {
  name: string
  data: {
    [attribute: string]: {
      createdat: number
      nullable: boolean
      type: attributesType
      unique: boolean
      length?: number
      comment: string
    }
  }
}
export function DataManagerTab() {
  const router = useRouter()
  const [schemaEntities, setSchemaEntities] = useState<schemaEntitiesType[]>()
  const [loading, setLoading] = useState(false)
  const [activeEntity, setActiveEntity] = useState<string>()
  const { handleFormatQueryOrMutationEntity } = consoleEditor.useConsoleEditor()

  async function loadSchema() {
    try {
      setLoading(true)
      const _schemaEntities: schemaEntitiesType[] = []

      const response = await utils.api
        .get(`${utils.apiRoutes.entityList(router.query.name as string)}`, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        })
        .catch(() => null)

      for (const entity of Object.keys(response?.data)) {
        delete response?.data[entity]?._conf
        _schemaEntities.push({ name: entity, data: response?.data[entity] })
      }

      setSchemaEntities(_schemaEntities)
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
      loadSchema()
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
      ) : !schemaEntities?.length ? (
        <div>
          <p className="font-extralight">Entities not found</p>
        </div>
      ) : (
        schemaEntities?.map((entity, idx) => (
          <Operation
            key={idx}
            entity={entity}
            activeEntity={activeEntity}
            handleFormatQueryOrMutationEntity={
              handleFormatQueryOrMutationEntity
            }
            setActiveEntity={setActiveEntity}
          />
        ))
      )}
    </div>
  )
}

function Operation({
  entity,
  activeEntity,
  handleFormatQueryOrMutationEntity,
  setActiveEntity
}: {
  entity: schemaEntitiesType
  activeEntity: string | undefined
  handleFormatQueryOrMutationEntity({
    entity,
    attribute,
    attributeType
  }: handleFormatQueryOrMutationEntityType): void
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
          <p className="text-sm font-light">{entity.name}</p>
        </div>
      </div>
      {active &&
        Object.keys(entity.data).map((attribute, idx) => (
          <div key={idx}>
            <div
              className={`flex items-center gap-2  ml-2 cursor-pointer ${
                activeEntity === `${entity}${attribute}` &&
                'text-text-highlight'
              }`}
              onClick={() => {
                setActiveEntity(`${entity}${attribute}`)
                handleFormatQueryOrMutationEntity({
                  entity: entity.name,
                  attribute,
                  attributeType: entity.data[attribute].type
                })
              }}
            >
              <div className="w-4 h-4">
                {activeEntity === `${entity.name}${attribute}` && <CheckIcon />}
              </div>

              <p className="text-sm font-extralight">
                {attribute}:{' '}
                <span className="text-gray-400">
                  {entity.data[attribute].type}
                </span>
              </p>
            </div>
          </div>
        ))}
    </div>
  )
}
