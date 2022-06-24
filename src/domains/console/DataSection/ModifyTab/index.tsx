import * as common from 'common'

type ModifyTabProps = {
  loading: boolean
  tableFields: string[]
  tableData?: {
    name: string
    comment: string
    createdAt: number
    isIndex: boolean
    isNullable: boolean
    isUnique: boolean
    length: number
    type: string
  }[]
}

export function ModifyTab({ loading, tableFields, tableData }: ModifyTabProps) {
  return (
    <div
      className={`flex flex-col ${
        loading ? 'items-center justify-center' : 'items-start'
      } h-full bg-gray-100 p-6 rounded-b-lg gap-2`}
    >
      <h3 className="text-lg">Columns:</h3>
      {tableData?.map((data, index) => (
        <div key={index} className="flex gap-4">
          <button className="px-1 py-1 text-sm bg-white border border-gray-400 rounded-md">
            Details
          </button>
          <p className="font-bold">
            {data.name} -{' '}
            <span className="font-normal text-gray-700">
              {data.type} {data.isNullable ? ',Nullable' : ''} 
              {data.isUnique ? ',Unique' : ''}
            </span>
          </p>
        </div>
      ))}
    </div>
  )
}
