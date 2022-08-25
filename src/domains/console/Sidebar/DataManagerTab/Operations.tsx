import * as common from 'common'

import { Icon } from '@iconify/react'
import { useState } from 'react'

import type { handleFormatQueryOrMutationEntityType } from 'domains/console/ConsoleEditorContext'
import type { schemaEntitiesType } from 'domains/console/Sidebar/DataManagerTab'

export function Operations({
  entity,
  activeEntitiesSidebar,
  handleFormatQueryOrMutationEntity
}: {
  entity: schemaEntitiesType
  activeEntitiesSidebar: Set<string>
  handleFormatQueryOrMutationEntity({
    entity,
    attribute,
    attributeType
  }: handleFormatQueryOrMutationEntityType): void
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
              className={`flex items-center gap-2  ml-2 cursor-pointer`}
              onClick={() => {
                handleFormatQueryOrMutationEntity({
                  entity: entity.name,
                  attribute,
                  attributeType: entity.data[attribute].type
                })
                if (activeEntitiesSidebar.has(`${entity.name}-${attribute}`)) {
                  activeEntitiesSidebar.delete(`${entity.name}-${attribute}`)
                  return
                }
                activeEntitiesSidebar.add(`${entity.name}-${attribute}`)
              }}
            >
              <common.icons.RadioCheckIcon
                checked={activeEntitiesSidebar.has(
                  `${entity.name}-${attribute}`
                )}
              />

              <div className="flex gap-1 text-sm font-extralight">
                <span>{attribute}:</span>
                <span className="text-gray-400">
                  {entity.data[attribute].type}
                  {entity.data[attribute].type === 'String' &&
                    entity.data[attribute].length}
                </span>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}
