import { Column } from './Column'
import * as types from 'domains/console/types'

type ModifyTabProps = {
  loading: boolean
  tableData?: types.TableData[]
}

export function ModifyTab({ loading, tableData }: ModifyTabProps) {
  return (
    <div
      className={`flex flex-col ${
        loading ? 'items-center justify-center' : 'items-start'
      } h-full bg-gray-100 p-6 rounded-b-lg gap-2`}
    >
      <h3 className="text-lg">Columns:</h3>
      {tableData?.map((data) => (
        <Column key={data.name} data={data} />
      ))}
    </div>
  )
}
