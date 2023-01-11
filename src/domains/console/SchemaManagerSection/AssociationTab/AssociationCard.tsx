import { useState } from 'react'
import { FieldDetail } from './FieldDetail'
import * as common from 'common'
import * as types from 'domains/console/types'
import { ArrowNarrowRightIcon } from '@heroicons/react/outline'

export function AssociationCard({
  attribute,
  schemaTables,
  selectedEntity,
  noEdit = false,
  reverse = false
}: {
  attribute: string
  selectedEntity: string
  schemaTables: types.SchemaTable
  noEdit?: boolean
  reverse?: boolean
}) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="w-full">
      {showDetails ? (
        <FieldDetail
          attribute={attribute}
          schemaTables={schemaTables}
          setShowDetails={setShowDetails}
        />
      ) : (
        <div className="flex items-center gap-4 mb-2">
          {!noEdit && (
            <common.Buttons.WhiteOutline
              type="button"
              onClick={() => setShowDetails(true)}
            >
              Edit
            </common.Buttons.WhiteOutline>
          )}
          <p>{attribute}</p>

          <div
            className={`flex items-center gap-4 text-sm text-gray-500 ${
              reverse ? 'flex-row-reverse' : ''
            }`}
          >
            {selectedEntity} . {attribute}
            <ArrowNarrowRightIcon className="w-5" />
            {schemaTables![selectedEntity as string][attribute]?.type}
          </div>
        </div>
      )}
    </div>
  )
}
