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
    <div className="flex gap-4">
      <common.Buttons.White
        className="px-2 py-1 text-sm bg-white border border-gray-300 rounded-md"
        type="button"
        onClick={() => setShowDetails(true)}
      >
        Edit
      </common.Buttons.White>
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
