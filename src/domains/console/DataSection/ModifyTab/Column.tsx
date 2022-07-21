import * as types from 'domains/console/types'
import { useState } from 'react'
import { FieldDetail } from './FieldDetail'
import * as common from 'common'

export function Column({ data }: { data: types.TableData }) {
  const [showDetails, setShowDetails] = useState(false)

  if (showDetails) {
    return <FieldDetail setShowDetails={setShowDetails} data={data} />
  }
  return (
    <div className="flex gap-4 items-center">
      <common.Buttons.WhiteOutline
        type="button"
        onClick={() => setShowDetails(true)}
      >
        Edit
      </common.Buttons.WhiteOutline>
      <p className="font-bold">
        {data.name} -{' '}
        <span className="font-normal text-gray-700">
          {data.type}
          {data.isNullable ? ', Nullable' : ''}
          {data.isUnique ? ', Unique' : ''}
          {data.isIndex ? ', Index' : ''}
        </span>
      </p>
    </div>
  )
}
