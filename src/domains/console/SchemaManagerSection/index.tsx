import * as common from 'common'
import * as types from 'domains/console/types'
import * as consoleSection from 'domains/console'
import { useEffect, useState } from 'react'
import * as utils from 'utils'
import { getCookie } from 'utils/cookies'
import { useRouter } from 'next/router'
import { PencilIcon } from '@heroicons/react/outline'
import { CheckCircleIcon, PlusIcon } from '@heroicons/react/solid'

export function SchemaManagerSection() {
  const [selectedEntityTab, setSelectedEntityTab] = useState({
    name: 'Attributes'
  })
  const router = useRouter()
  const {
    selectedEntity,
    setOpenSlide,
    reload,
    setEntityData,
    showCreateEntitySection,
    setSlideType,
    breadcrumbPages,
    setSchemaStatus,
    breadcrumbPagesData,
    setBreadcrumbPages,
    setShowCreateEntitySection,
    currentTabSchema,
    selectedTabUsersAndRoles,
    setSelectedTabUsersAndRoles
  } = consoleSection.useSchemaManager()
  const [loading, setLoading] = useState(true)

  async function loadEntityData() {
    try {
      const { data } = await utils.api.get(
        `${utils.apiRoutes.entity(
          router.query.name as string
        )}/${selectedEntity}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie('access_token')}`
          }
        }
      )
      const entityData: types.EntityData[] = []
      Object.keys(data).map((key) => {
        if (key !== '_classDef') {
          entityData.push({
            name: key,
            ...data[key]
          })
        }
      })
      const entityFields = Object.keys(data).filter((value) => value[0] !== '_')
      entityFields.unshift('id')
      setEntityData(entityData)
      setLoading(false)
    } catch (err) {
      utils.showError(err)
    }
  }

  useEffect(() => {
    if (selectedEntity) {
      loadEntityData()
    }
    return () => setLoading(true)
  }, [selectedEntity, reload])

  useEffect(() => {
    utils.api
      .get(`${utils.apiRoutes.schemas}/${router.query.name as string}`, {
        headers: {
          Authorization: `Bearer ${utils.getCookie('access_token')}`
        }
      })
      .then(({ data }) => {
        setSchemaStatus(data.status)
      })
  }, [])

  if (showCreateEntitySection) {
    return (
      <div className="w-full h-full py-4 px-8 ">
        <consoleSection.CreateEntity />
      </div>
    )
  }

  return (
    <div data-tour="step-1" className="w-full h-full py-4 px-8 ">
      <common.Card className="flex flex-col h-full">
        <div className="flex w-full h-[3.3rem]">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <common.Breadcrumb pages={breadcrumbPages} />
              {selectedEntity && (
                <PencilIcon
                  className="w-3 h-3 text-gray-500 cursor-pointer"
                  onClick={() => {
                    setOpenSlide(true)
                    setSlideType('UPDATE ENTITY')
                  }}
                />
              )}
            </div>
            {!selectedEntity && currentTabSchema === 'Databases' && (
              <common.Buttons.WhiteOutline
                type="button"
                onClick={() => {
                  setShowCreateEntitySection(true)
                  setBreadcrumbPages(breadcrumbPagesData.createEntity)
                }}
                icon={<PlusIcon className="w-3 h-3" />}
              >
                Create entity
              </common.Buttons.WhiteOutline>
            )}
            {currentTabSchema === 'Modeler' && (
              <common.Buttons.WhiteOutline
                type="button"
                onClick={() => null}
                icon={<CheckCircleIcon className="w-4 h-4 !text-green-700 " />}
                disabled
              >
                Deploy
              </common.Buttons.WhiteOutline>
            )}
            {currentTabSchema === 'Users and Roles' && (
              <div className={` w-1/3 `}>
                <common.Tabs
                  tabs={[{ name: 'Accounts' }, { name: 'Roles' }]}
                  selectedTab={selectedTabUsersAndRoles}
                  setSelectedTab={setSelectedTabUsersAndRoles}
                />
              </div>
            )}
          </div>
          <div className={`${selectedEntity ? '' : 'hidden '} w-1/3 `}>
            <common.Tabs
              selectedTab={selectedEntityTab}
              setSelectedTab={setSelectedEntityTab}
              tabs={[{ name: 'Attributes' }, { name: 'Associations' }]}
            />
          </div>
        </div>
        <consoleSection.SlidePanel />
        <div className="bg-white rounded-md dark:bg-menu-primary w-full">
          <common.ContentSection variant="WithoutTitleBackgroundColor">
            {currentTabSchema === 'Databases' ? (
              selectedEntity ? (
                selectedEntityTab.name === 'Attributes' ? (
                  <consoleSection.ModifyTab loading={loading} />
                ) : (
                  <consoleSection.AssociationTab loading={loading} />
                )
              ) : (
                <consoleSection.DefaultPage />
              )
            ) : currentTabSchema === 'Modeler' ? (
              <consoleSection.Modeler />
            ) : currentTabSchema === 'Users and Roles' ? (
              <consoleSection.UsersSection />
            ) : (
              <div />
            )}
          </common.ContentSection>
        </div>
      </common.Card>
    </div>
  )
}
