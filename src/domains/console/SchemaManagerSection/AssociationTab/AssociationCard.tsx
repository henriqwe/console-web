import { useState } from 'react'
import { FieldDetail } from './FieldDetail'
import * as common from 'common'
import * as types from 'domains/console/types'
import { ArrowNarrowRightIcon } from '@heroicons/react/outline'

export function AssociationCard({
  attribute,
  schemaTables,
  selectedEntity
}: {
  attribute: string
  selectedEntity?: string
  schemaTables?: types.SchemaTable
}) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="px-4 py-2 border border-t-0">
      {showDetails ? (
        <FieldDetail
          attribute={attribute}
          schemaTables={schemaTables}
          setShowDetails={setShowDetails}
        />
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2">
            <common.Buttons.WhiteOutline
              type="button"
              onClick={() => setShowDetails(true)}
            >
              Edit
            </common.Buttons.WhiteOutline>
            <p>{attribute}</p>
          </div>
          <p className="flex gap-4 text-sm text-gray-500">
            {selectedEntity} . {attribute}{' '}
            <ArrowNarrowRightIcon className="w-5" />
            {schemaTables![selectedEntity as string][attribute].type}
          </p>
        </>
      )}
    </div>
  )
}
