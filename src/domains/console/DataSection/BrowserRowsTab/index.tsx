import * as common from 'common'

type BrowserRowsProps = {
  loading: boolean
  tableFields: string[]
}

export function BrowserRowsTab({loading, tableFields}:BrowserRowsProps) {
  return (
    <div
      className={`flex flex-col ${
        loading ? 'items-center justify-center' : 'items-start'
      } h-full bg-white rounded-b-lg`}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-20 h-20">
            <common.Spinner />
          </div>

          <p className="text-lg font-bold text-gray-700">Loading table data</p>
        </div>
      ) : (
        <div className="w-full h-full bg-gray-100 overflow-y">
          <common.Table tableColumns={tableFields} values={[{}]} />
        </div>
      )}
    </div>
  )
}
