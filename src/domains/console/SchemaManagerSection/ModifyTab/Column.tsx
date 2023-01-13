import * as types from 'domains/console/types'
import { useState } from 'react'
import { FieldDetail } from './FieldDetail'
import { PencilIcon } from '@heroicons/react/outline'

import * as common from 'common'

export function Column({
  data,
  noEdit = false
}: {
  data: types.EntityData
  noEdit?: boolean
}) {
  const [showDetails, setShowDetails] = useState(false)

  if (showDetails) {
    return <FieldDetail setShowDetails={setShowDetails} data={data} />
  }
  return (
    <div className="flex items-center gap-4">
      {!noEdit ? (
        <common.Buttons.WhiteOutline
          type="button"
          onClick={() => setShowDetails(true)}
        >
          <PencilIcon className="w-5 h-5" data-testid="edit" />
        </common.Buttons.WhiteOutline>
      ) : (
        <div className="w-1 h-1 ml-1 rounded-full bg-slate-700" />
      )}
      <p className="font-semibold dark:text-text-secondary">
        {data.name} -{' '}
        <span className="font-normal text-gray-700 dark:text-text-tertiary">
          {data.type}
          {data.nullable ? ', Nullable' : ''}
          {data.unique ? ', Unique' : ''}
          {data.isIndex ? ', Index' : ''}
        </span>
      </p>
    </div>
  )
}
