import * as common from 'common'
import * as types from 'domains/console/types'
import * as consoleSection from 'domains/console'
import { useEffect, useState } from 'react'
import * as utils from 'utils'
import * as services from 'services'

import { getCookie } from 'utils/cookies'
import { useRouter } from 'next/router'
import { PencilIcon } from '@heroicons/react/outline'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  PlusIcon
} from '@heroicons/react/solid'
import { TourProvider } from '@reactour/tour'

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
    breadcrumbPages,
    setSchemaStatus,
    breadcrumbPagesData,
    setBreadcrumbPages,
    setShowCreateEntitySection,
    currentTabSchema,
    selectedTabUsersAndRoles,
    setSelectedTabUsersAndRoles
  } = consoleSection.useSchemaManager()
  const { deploySchema } = consoleSection.useConsoleEditor()
  const [loading, setLoading] = useState(true)

  async function loadEntityData() {
    try {
      const { data } = await services.ycodify.getEntity({
        accessToken: getCookie('access_token') as string,
        name: router.query.name as string,
        selectedEntity: selectedEntity as string
      })

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
    services.ycodify
      .getSchema({
        accessToken: utils.getCookie('access_token') as string,
        name: router.query.name as string
      })
      .then(({ data }) => {
        setSchemaStatus(data.status)
      })
      .catch((err) => utils.showError(err))
  }, [])

  function beforeClose() {
    if (currentTabSchema === 'Databases')
      window.localStorage.setItem('toured-database', 'true')
    else if (currentTabSchema === 'Modeler')
      window.localStorage.setItem('toured-modeler', 'true')
    else if (currentTabSchema === 'Users and Roles') {
      if (selectedTabUsersAndRoles.name === 'Users')
        window.localStorage.setItem('toured-users', 'true')
      else if (selectedTabUsersAndRoles.name === 'Roles')
        window.localStorage.setItem('toured-roles', 'true')
    }
  }

  if (showCreateEntitySection) {
    return (
      <div className="w-full h-full px-8 py-4 ">
        <consoleSection.CreateEntity />
      </div>
    )
  }

  return (
    <TourProvider
      steps={[]}
      styles={{
        popover: (base) => ({
          ...base,
          '--reactour-accent': '#0cd664',
          borderRadius: 10
        }),
        dot: (base, { current }: any) => ({
          ...base,
          backgroundColor: current ? '#0cd664' : '#ccc'
        })
      }}
      prevButton={({ currentStep, setCurrentStep }) => (
        <common.Buttons.Ycodify
          onClick={() => setCurrentStep(currentStep - 1)}
          icon={<ArrowLeftIcon className="w-3 h-3" />}
          iconPosition="left"
          className="mr-2"
        ></common.Buttons.Ycodify>
      )}
      nextButton={({ steps, currentStep, setCurrentStep }) => {
        return (
          <common.Buttons.Ycodify
            onClick={() => setCurrentStep(currentStep + 1)}
            icon={<ArrowRightIcon className="w-3 h-3" />}
            className="ml-2 w-max"
          >
            {currentStep === steps!.length - 1 ? 'Finish' : ''}
          </common.Buttons.Ycodify>
        )
      }}
      showCloseButton={false}
      beforeClose={() => beforeClose()}
      onClickMask={() => {}}
    >
      <div className="w-full h-full px-8 py-4 ">
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
                    }}
                    data-testid="editIcon"
                  />
                )}
              </div>
              {!selectedEntity && currentTabSchema === 'Databases' && (
                <span className="bg-white rounded-md">
                  <common.Buttons.WhiteOutline
                    type="button"
                    onClick={() => {
                      setShowCreateEntitySection(true)
                      setBreadcrumbPages(breadcrumbPagesData.createEntity)
                    }}
                    icon={<PlusIcon className="w-3 h-3" />}
                    className="database-step-3"
                  >
                    Create entity
                  </common.Buttons.WhiteOutline>
                </span>
              )}

              {currentTabSchema === 'Modeler' && (
                <common.Buttons.WhiteOutline
                  type="button"
                  onClick={deploySchema}
                  icon={
                    <CheckCircleIcon className="w-4 h-4 !text-green-700 " />
                  }
                >
                  Deploy
                </common.Buttons.WhiteOutline>
              )}
              {currentTabSchema === 'Users and Roles' && (
                <div className={` w-1/3 `}>
                  <common.Tabs
                    tabs={[{ name: 'Users' }, { name: 'Roles' }]}
                    selectedTab={selectedTabUsersAndRoles}
                    setSelectedTab={setSelectedTabUsersAndRoles}
                  />
                </div>
              )}
              {currentTabSchema === 'Databases' && (
                <div className={`w-1/3 ${selectedEntity ? '' : 'hidden'}`}>
                  <common.Tabs
                    selectedTab={selectedEntityTab}
                    setSelectedTab={setSelectedEntityTab}
                    tabs={[
                      { name: 'Attributes' },
                      { name: 'Associations' },
                      { name: 'Lambda' }
                    ]}
                  />
                </div>
              )}
            </div>
          </div>
          <consoleSection.SlidePanel />
          <div className="w-full bg-white rounded-md dark:bg-menu-primary">
            <common.ContentSection variant="WithoutTitleBackgroundColor">
              {currentTabSchema === 'Databases' ? (
                selectedEntity ? (
                  selectedEntityTab.name === 'Attributes' ? (
                    <consoleSection.ModifyTab loading={loading} />
                  ) : selectedEntityTab.name === 'Associations' ? (
                    <consoleSection.AssociationTab loading={loading} />
                  ) : (
                    <consoleSection.LambdaTab />
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
    </TourProvider>
  )
}
