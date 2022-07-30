import { useState } from 'react'
import { FieldDetail } from './FieldDetail'
import * as common from 'common'
import { ArrowNarrowRightIcon } from '@heroicons/react/outline'

export function RelationshipCard(/*{ data }: { data: types.TableData }*/) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="px-4 py-2 border border-t-0">
      {showDetails ? (
        <FieldDetail data={{ name: '' }} setShowDetails={setShowDetails} />
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2">
            <common.Buttons.WhiteOutline
              type="button"
              onClick={() => setShowDetails(true)}
            >
              Edit
            </common.Buttons.WhiteOutline>
            <p>Book</p>
          </div>
          <p className="flex gap-4 text-sm text-gray-500">
            Branch . Book_Id <ArrowNarrowRightIcon className="w-5" /> Book . Id
          </p>
        </>
      )}
    </div>
  )
}
