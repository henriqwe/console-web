import * as common from 'common'
import * as consoleEditor from 'domains/console/ConsoleEditorContext'
import * as schemaManager from 'domains/console/SchemaManagerContext'

import { Icon } from '@iconify/react'
import { useState } from 'react'

import type { schemaEntitiesType } from 'domains/console/Sidebar/DataApiTab'
import { LockClosedIcon } from '@heroicons/react/solid'

export function Operations({ entity }: { entity: schemaEntitiesType }) {
  const [active, setActive] = useState(false)
  const {
    handleFormatQueryOrMutationEntityAndAttribute,
    handleFormatQueryOrMutationEntity,
    activeEntitiesSidebar,
    currentEditorAction
  } = consoleEditor.useConsoleEditor()
  const { privateAttributes } = schemaManager.useSchemaManager()

  return (
    <div className="flex flex-col gap-2 mb-2 ">
      <div className={`flex items-center gap-2 `}>
        <div
          onClick={() => {
            handleFormatQueryOrMutationEntity({
              entity: entity.name
            })
            if (activeEntitiesSidebar.has(`${entity.name}`)) {
              activeEntitiesSidebar.delete(`${entity.name}`)
              return
            }
            activeEntitiesSidebar.add(`${entity.name}`)
          }}
          className=" cursor-pointer"
        >
          <common.icons.RadioCheckIcon
            checked={activeEntitiesSidebar.has(`${entity.name}`)}
          />
        </div>
        <div
          className="flex items-center gap-1  cursor-pointer"
          onClick={() => {
            setActive(!active)
          }}
        >
          <p className="text-sm font-light">{entity.name}</p>
          <Icon
            icon="bx:chevron-right"
            className={`w-4 h-4 transition ${active && 'rotate-90'}`}
          />
        </div>
      </div>
      {active &&
        Object.keys({ id: idColumnData, ...entity.data }).map(
          (attribute, idx) => {
            const block =
              currentEditorAction !== 'READ' &&
              privateAttributes.includes(attribute)
            return (
              <div key={idx}>
                <div
                  className={`flex items-center gap-2  ml-6 ${
                    block ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  onClick={() => {
                    if (!block) {
                      handleFormatQueryOrMutationEntityAndAttribute({
                        entity: entity.name,
                        attribute,
                        attributeType: entity.data[attribute].type
                      })
                      if (
                        activeEntitiesSidebar.has(`${entity.name}-${attribute}`)
                      ) {
                        activeEntitiesSidebar.delete(
                          `${entity.name}-${attribute}`
                        )
                        return
                      }
                      activeEntitiesSidebar.add(`${entity.name}`)
                      activeEntitiesSidebar.add(`${entity.name}-${attribute}`)
                    }
                  }}
                >
                  {block ? (
                    <LockClosedIcon className="w-4 h-4" />
                  ) : (
                    <common.icons.RadioCheckIcon
                      checked={activeEntitiesSidebar.has(
                        `${entity.name}-${attribute}`
                      )}
                    />
                  )}

                  <div className="flex gap-1 text-sm font-extralight">
                    <span>{attribute}:</span>
                    <span className="text-gray-400">
                      {entity.data[attribute].type}
                      {entity.data[attribute].type === 'String' &&
                        entity.data[attribute].length}
                      {!entity.data[attribute].nullable && '!'}
                    </span>
                  </div>
                </div>
              </div>
            )
          }
        )}
    </div>
  )
}

const idColumnData = {
  comment: 'metadata controlled by YCodify platform',
  nullable: false,
  unique: true,
  logcreatedat: 0,
  type: 'Integer'
}
