type TableProps = {
  tableColumns: string[]
  values?: any[]
}

export function Table({ tableColumns = [], values }: TableProps) {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col mt-8">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    {tableColumns.map((column) => (
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        key={column}
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {values ? (
                    values.map((value, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? undefined : 'bg-gray-50'}
                      >
                        {tableColumns.map((column, index) => (
                          <td
                            className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6"
                            key={value[column] || index}
                          >
                            {value[column]}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white  intro-x dark:bg-darkmode-600">
                      <td colSpan={tableColumns.length} className="py-2 text-center">
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
