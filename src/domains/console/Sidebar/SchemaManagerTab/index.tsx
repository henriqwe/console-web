import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import * as common from 'common'
import * as utils from 'utils'
import * as consoleSection from 'domains/console'
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
    breadcrumbPagesData,
    setSchemaTables
  } = consoleSection.useSchemaManager()
  const [entities, setEntities] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  async function loadEntities() {
    try {
      setLoading(true)

      const { data } = await utils.api.get(
        `${utils.apiRoutes.entityList(router.query.name as string)}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie('access_token')}`
          }
        }
      )

      setSchemaTables(data)
      setEntities(Object.keys(data) as string[])
    } catch (err: any) {
      if (err.response.status !== 404) {
        utils.showError(err)
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
    <div className="flex flex-col h-full gap-1 px-4 pt-3 overflow-y-auto">
      <div className="flex items-center w-full">
        <div
          className="flex items-center gap-2 font-light text-sm hover:cursor-pointer"
          onClick={() => {
            setShowCreateEntitySection(false)
            setSelectedEntity(undefined)
            setBreadcrumbPages(breadcrumbPagesData.home)
          }}
        >
          Entities &#40; {entities.length} &#41;{' '}
          <CheckCircleIcon className="w-4 h-4 text-iconGreen" />
        </div>
      </div>
      <common.Separator className="dark:border-gray-500/50" />
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-8 h-8 mr-8">
            <common.Spinner />
          </div>
          <div>Loading...</div>
        </div>
      ) : entities.length === 0 ? (
        <div>
          <p className="font-extralight">Entities not found</p>
        </div>
      ) : (
        <div>
          {entities.map((entity) => (
            <div key={entity}>
              <div
                className={`flex items-center gap-2 pb-2 cursor-pointer ${
                  selectedEntity === `${entity}` && 'text-text-highlight'
                }`}
                onClick={() => {
                  setSelectedEntity(`${entity}`)
                  setShowCreateEntitySection(false)
                  setBreadcrumbPages(breadcrumbPagesData.viewEntity(entity))
                }}
              >
                <Icon icon="bi:entity" className="w-4 h-4" />
                <p className="text-sm font-extralight">{entity}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
