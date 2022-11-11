import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import * as common from 'common'
import * as utils from 'utils'
import * as consoleSection from 'domains/console'
import { getCookie } from 'utils/cookies'
import { useRouter } from 'next/router'
import { CheckCircleIcon, ChevronUpIcon } from '@heroicons/react/solid'

export function SchemaManagerTab() {
  const router = useRouter()
  const {
    selectedEntity,
    setSelectedEntity,
    reload,
    setShowCreateEntitySection,
    setBreadcrumbPages,
    breadcrumbPagesData,
    setSchemaTables,
    goToEntitiesPage,
    goToModelerPage,
    setCurrentTabSchema,
    currentTabSchema,
    goToUserAndRolesPage
  } = consoleSection.useSchemaManager()
  const [entities, setEntities] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [showDatabase, setShowDatabase] = useState(
    currentTabSchema === 'Databases'
  )

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
    <div className="modeler-step-2 flex flex-col h-full gap-1 px-4 pt-3 overflow-y-auto">
      <div className="flex flex-col w-full">
        <div
          className={`modeler-step-3 flex items-center gap-2 text-sm hover:cursor-pointer ${
            currentTabSchema === 'Modeler' ? 'font-semibold' : 'font-light'
          }`}
          onClick={() => {
            goToModelerPage()
            setShowDatabase(false)
          }}
        >
          Modeler <Icon icon="bi:boxes" />
        </div>
        <common.Separator className="dark:border-gray-500/50" />

        <div
          className="flex items-center gap-2  text-sm hover:cursor-pointer"
          onClick={() => {
            setShowDatabase(true)
          }}
        >
          <div
            onClick={goToEntitiesPage}
            className={`${
              currentTabSchema === 'Databases' ? 'font-semibold' : 'font-light'
            } transition`}
          >
            Database &#40; {entities.length} &#41;
          </div>
          <ChevronUpIcon
            className={`${
              showDatabase ? 'rotate-180 transform' : ''
            } h-5 w-5 text-gray-700 dark:text-text-primary transition`}
          />
        </div>
        {showDatabase && (
          <>
            {loading ? (
              <div className="flex items-center justify-center w-full h-full">
                <div className="w-8 h-8 mr-8">
                  <common.Spinner />
                </div>
                <div>Loading...</div>
              </div>
            ) : entities.length === 0 ? (
              <div>
                <p className="font-extralight">Database not found</p>
              </div>
            ) : (
              <div>
                {entities.map((entity) => (
                  <div key={entity}>
                    <div
                      className={`ml-2 flex items-center py-1 cursor-pointer ${
                        selectedEntity === `${entity}` && 'text-text-highlight'
                      }`}
                      onClick={() => {
                        setSelectedEntity(`${entity}`)
                        setShowCreateEntitySection(false)
                        setBreadcrumbPages(
                          breadcrumbPagesData.viewEntity(entity)
                        )
                        setCurrentTabSchema('Databases')
                      }}
                    >
                      <Icon icon="bi:entity" className="w-4 h-4" />
                      <p className="text-sm font-extralight">{entity}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        <common.Separator className="dark:border-gray-500/50" />
        <div
          className={`flex items-center gap-2  text-sm hover:cursor-pointer ${
            currentTabSchema === 'Users and Roles'
              ? 'font-semibold'
              : 'font-light'
          }`}
          onClick={() => {
            goToUserAndRolesPage()
            setShowDatabase(false)
          }}
        >
          Users and roles
        </div>
      </div>
    </div>
  )
}
