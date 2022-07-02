import { Column } from './Column'
import * as consoleSection from 'domains/console'

type ModifyTabProps = {
  loading: boolean
}

export function ModifyTab({ loading }: ModifyTabProps) {
  const { tableData } = consoleSection.useData()
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
