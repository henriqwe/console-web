import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import * as common from 'common'
import * as consoleSection from 'domains/console'
import { useRouter } from 'next/router'
import { ChevronUpIcon } from '@heroicons/react/solid'

export function SchemaManagerTab() {
  const router = useRouter()
  const {
    selectedEntity,
    setSelectedEntity,
    reload,
    setShowCreateEntitySection,
    setBreadcrumbPages,
    breadcrumbPagesData,
    goToEntitiesPage,
    goToModelerPage,
    setCurrentTabSchema,
    currentTabSchema,
    goToUserAndRolesPage,
    entities,
    loadEntities,
    entitiesLoading
  } = consoleSection.useSchemaManager()
  const [showDatabase, setShowDatabase] = useState(
    currentTabSchema === 'Databases'
  )

  useEffect(() => {
    if (router.query.name) {
      loadEntities()
    }
  }, [router.query.name, reload])

  return (
    <div className="flex flex-col h-full gap-1 px-4 pt-3 overflow-y-auto modeler-step-2">
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
          className="flex items-center gap-2 text-sm hover:cursor-pointer"
          onClick={() => {
            setShowDatabase(true)
          }}
          data-testid="showDatabase"
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
            {entitiesLoading ? (
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
