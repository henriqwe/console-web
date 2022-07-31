import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import * as common from 'common'
import * as utils from 'utils'
import * as consoleSection from 'domains/console'
import axios from 'axios'
import { getCookie } from 'utils/cookies'
import { useRouter } from 'next/router'
import { CheckCircleIcon } from '@heroicons/react/solid'

export function SchemaManagerTab() {
  const router = useRouter()
  const {
    selectedEntity,
    setSelectedEntity,
    reload,
    setShowCreateEntitySection,
    setBreadcrumbPages,
    breadcrumbPagesData
  } = consoleSection.useSchemaManager()
  const [entities, setEntities] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  async function loadEntities() {
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
      setEntities(Object.keys(data.data) as string[])
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
      loadEntities()
    }
  }, [router.query.name, reload])

  return (
    <div className="flex flex-col h-full px-4 overflow-y-auto pt-1 ">
      <div className="flex items-center w-full">
        <div
          className="font-semibold flex items-center gap-2 hover:cursor-pointer"
          onClick={() => {
            setShowCreateEntitySection(false)
            setSelectedEntity(undefined)
            setBreadcrumbPages(breadcrumbPagesData.home)
          }}
        >
          Entities &#40; {entities.length} &#41;{' '}
          <CheckCircleIcon className="text-green-600 w-4 h-4" />
        </div>
      </div>
      <common.Separator />
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-8 h-8 mr-8">
            <common.Spinner />
          </div>
          <div>Loading...</div>
        </div>
      ) : entities.length === 0 ? (
        <div>
          <p>Entities not found</p>
        </div>
      ) : (
        entities.map((entity) => (
          <div key={entity}>
            <div
              className={`flex items-center gap-2 pb-2 cursor-pointer ${
                selectedEntity === `${entity}` && 'text-orange-400'
              }`}
              onClick={() => {
                setSelectedEntity(`${entity}`)
                setShowCreateEntitySection(false)
              }}
            >
              <Icon icon="bi:entity" className="w-4 h-4" />
              <p className="text-sm">{entity}</p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
