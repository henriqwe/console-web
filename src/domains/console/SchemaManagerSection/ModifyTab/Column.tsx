import * as types from 'domains/console/types'
import { useState } from 'react'
import { FieldDetail } from './FieldDetail'
import * as common from 'common'

export function Column({ data }: { data: types.EntityData }) {
  const [showDetails, setShowDetails] = useState(false)

  if (showDetails) {
    return <FieldDetail setShowDetails={setShowDetails} data={data} />
  }
  return (
    <div className="flex gap-4 items-center">
      <common.Buttons.Clean type="button" onClick={() => setShowDetails(true)}>
        Edit
      </common.Buttons.Clean>
      <p className="font-bold">
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
