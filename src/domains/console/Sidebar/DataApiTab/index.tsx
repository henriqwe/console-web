import * as common from 'common'
import * as utils from 'utils'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Operations } from 'domains/console/Sidebar/DataApiTab/Operations'

import type { attributesType } from 'domains/console/ConsoleEditorContext'

export type schemaEntitiesType = {
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
export function DataApiTab() {
  const router = useRouter()
  const [schemaEntities, setSchemaEntities] = useState<schemaEntitiesType[]>()
  const [loading, setLoading] = useState(false)

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
    <div className="flex flex-col flex-1 h-full gap-1 px-4 pt-3 overflow-y-auto rounded-b-lg">
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
          <Operations key={idx} entity={entity} />
        ))
      )}
    </div>
  )
}
