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
          <PencilIcon className="w-5 h-5" />
        </common.Buttons.WhiteOutline>
      ) : (
        <div className="ml-1 w-1 h-1 rounded-full bg-slate-700" />
      )}
      <p className="font-semibold">
        {data.name} -{' '}
        <span className="font-normal text-gray-700 dark:text-gray-400">
          {data.type}
          {data.isNullable ? ', Nullable' : ''}
          {data.isUnique ? ', Unique' : ''}
          {data.isIndex ? ', Index' : ''}
        </span>
      </p>
    </div>
  )
}
