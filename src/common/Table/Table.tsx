import { ReactNode } from 'react'

type TableProps = {
  tableColumns: {
    name: string
    displayName: string
    handler?: (value: any) => void
  }[]
  values?: any[]
  actions?: (item: { item: { title: string; fieldName: string } }) => ReactNode
  rounded?: boolean
}

export function Table({
  tableColumns = [],
  values,
  actions,
  rounded = false
}: TableProps) {
  return (
    <div className="w-full ">
      <div className="flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div
              className={`overflow-hidden shadow ring-1 ring-black dark:ring-gray-600 ring-opacity-5 ${
                rounded ? 'rounded-lg' : ''
              }`}
            >
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    {tableColumns.map((column) => (
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-200 sm:pl-6"
                        key={column.name}
                      >
                        {column.displayName}
                      </th>
                    ))}
                    {actions && (
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-200 sm:pl-6"
                      >
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900">
                  {values ? (
                    values.map((value, index) => (
                      <tr
                        key={index}
                        className={`dark:text-gray-300
                          ${
                            index % 2 === 0
                              ? undefined
                              : 'bg-gray-50 dark:bg-gray-800'
                          }`}
                      >
                        {tableColumns.map((column, index) => (
                          <td
                            className="py-4 pl-4 pr-3 text-xs font-medium text-gray-900 dark:text-gray-200 whitespace-nowrap sm:pl-6"
                            key={value[column.name] || index}
                          >
                            {column.handler
                              ? column.handler(value[column.name])
                              : value[column.name]}
                          </td>
                        ))}
                        {actions && actions({ item: value })}
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white dark:bg-gray-800 intro-x ">
                      <td
                        colSpan={
                          actions
                            ? tableColumns.length + 1
                            : tableColumns.length
                        }
                        className="py-2 text-center"
                      >
                        Data not found!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
