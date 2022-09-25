import { ReactNode } from 'react'

type TableProps = {
  tableColumns?: {
    name: string
    displayName: string
    handler?: (value: any) => void
  }[]
  values?: any[]
  actions?: (item: { item: { title: string; fieldName: string } }) => ReactNode
  rounded?: boolean
  notFoundMessage?: string
}

export function Table({
  tableColumns = [],
  values,
  actions,
  rounded = false,
  notFoundMessage = 'Data not found!'
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
              role="tableWrapper"
            >
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-menu-primary">
                  <tr>
                    {tableColumns.map((column) => (
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 dark:text-text-primary sm:pl-6"
                        key={column.name}
                      >
                        {column.displayName}
                      </th>
                    ))}
                    {actions && (
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 dark:text-text-primary sm:pl-6"
                      >
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-menu-secondary">
                  {values && values?.length > 0 ? (
                    values.map((value, index) => (
                      <tr
                        key={index}
                        className={`dark:text-text-secondary
                          ${
                            index % 2 === 0
                              ? undefined
                              : 'bg-gray-50 dark:bg-menu-primary'
                          }`}
                        data-testid={'tr' + index}
                      >
                        {tableColumns.map((column) => (
                          <td
                            className="py-4 pl-4 pr-3 text-xs font-medium text-gray-900 dark:text-text-primary whitespace-nowrap sm:pl-6"
                            key={value[column.name]}
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
                    <tr
                      className={
                        'bg-white dark:text-white dark:bg-menuItem-primary intro-x '
                      }
                    >
                      <td
                        colSpan={
                          actions
                            ? tableColumns.length + 1
                            : tableColumns.length
                        }
                        className="py-2 text-center"
                      >
                        {notFoundMessage}
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
