import * as common from 'common'
import * as types from 'domains/console/types'
import * as consoleSection from 'domains/console'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { getCookie } from 'utils/cookies'
import { useRouter } from 'next/router'
import { PencilIcon } from '@heroicons/react/outline'

export function SchemaManagerSection() {
  const router = useRouter()
  const {
    selectedEntity,
    setOpenSlide,
    reload,
    setEntityData,
    showCreateEntitySection,
    setSlideType
  } = consoleSection.useData()
  const [loading, setLoading] = useState(true)

  async function loadEntityData() {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_YCODIFY_API_URL}/api/modeler/schema/${router.query.name}/entity/${selectedEntity}`,
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
  }

  useEffect(() => {
    if (selectedEntity) {
      loadEntityData()
    }
    return () => setLoading(true)
  }, [selectedEntity, reload])

  if (showCreateEntitySection) {
    return (
      <div className="w-full h-full p-4">
        <consoleSection.CreateEntity />
      </div>
    )
  }

  return (
    <div data-tour="step-1" className="w-full h-full p-4">
      <common.Card className="flex flex-col h-full">
        <consoleSection.SlidePanel />
        <common.ContentSection
          title={
            <div className="flex gap-2">
              <p className="text-base text-gray-900">
                {selectedEntity ? selectedEntity : 'Entities'}
              </p>
              {selectedEntity && (
                <PencilIcon
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => {
                    setOpenSlide(true)
                    setSlideType('UPDATE ENTITY')
                  }}
                />
              )}
            </div>
          }
        >
          {selectedEntity ? (
            <consoleSection.ModifyTab loading={loading} />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-white rounded-b-lg">
              <div className="flex flex-col items-center ">
                <div className="mb-5 w-72">
                  <common.illustrations.Empty />
                </div>
                <div className="text-lg">Select an entity to see all data</div>
              </div>
            </div>
          )}
        </common.ContentSection>
      </common.Card>
    </div>
  )
}
