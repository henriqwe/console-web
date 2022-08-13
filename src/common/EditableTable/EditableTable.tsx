import { Control, Controller, FieldValues } from 'react-hook-form'

type EditableTableProps = {
  columns: {
    title: string
    key: string
    type: 'normal' | 'input' | 'password' | 'checkbox'
    placeholder?: string
  }[]
  collection: any
  inputPlaceholder?: string
  disabled?: boolean
  control: Control<FieldValues, object>
  fieldName: string
  onChangeModifier?: (value: any) => any
}

export function EditableTable({
  columns,
  collection,
  disabled = false,
  control,
  fieldName,
  inputPlaceholder,
  onChangeModifier
}: EditableTableProps) {
  return (
    <div className="flex flex-col my-4">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-white md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-200">
              <thead className="bg-gray-50 dark:bg-darkmode-300">
                <tr className="divide-x divide-gray-200">
                  {columns.map((column, index) => (
                    <th
                      scope="col"
                      className="py-1.5 pl-4 first:pr-4 last:pr-4 text-left text-sm font-semibold text-gray-600 first:sm:pl-6 last:sm:pr-6 dark:text-gray-200"
                      key={`${column.title}-${column.key}}`}
                    >
                      {column.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-darkmode-800">
                {collection.map((item: any, index: number) => (
                  <tr key={index} className="divide-x divide-gray-200">
                    {columns.map((column) =>
                      column.type === 'input' ? (
                        <td
                          className={`py-2 text-sm font-medium text-gray-800  first:pr-4 last:pr-4 whitespace-nowrap first:sm:pl-6 last:sm:pr-6 dark:text-gray-100 ${
                            !disabled && column.type === 'input'
                              ? 'bg-white dark:bg-darkmode-600'
                              : 'bg-gray-100 dark:bg-darkmode-800'
                          }`}
                          key={`${item[column.key]}-${column.title}`}
                        >
                          {item.icon ? (
                            <span className="pl-4">{item.icon}</span>
                          ) : undefined}
                          <Controller
                            name={`${fieldName}-${column.key}-${index}`}
                            control={control}
                            defaultValue={item[column.key]}
                            render={({ field: { onChange, value } }) => (
                              <input
                                autoComplete="off"
                                id={fieldName}
                                type="text"
                                className={`w-full h-full truncate peer focus:outline-none bg-transparent disabled:cursor-not-allowed border-0 text-sm ${
                                  item.icon ? 'pl-0' : 'px-2'
                                }`}
                                disabled={disabled}
                                placeholder={inputPlaceholder || ''}
                                value={value}
                                onChange={(e) => {
                                  let finalValue = e
                                  if (onChangeModifier) {
                                    finalValue = onChangeModifier(finalValue)
                                  }
                                  e = finalValue
                                  onChange(e.target.value)
                                }}
                              />
                            )}
                          />
                        </td>
                      ) : column.type === 'checkbox' ? (
                        <td
                          className={`py-2 text-sm font-medium text-gray-800  first:pr-4 last:pr-4 whitespace-nowrap first:sm:pl-6 last:sm:pr-6 dark:text-gray-100 ${
                            !disabled
                              ? 'bg-white dark:bg-darkmode-600'
                              : 'bg-gray-100 dark:bg-darkmode-800'
                          }`}
                          key={`${item[column.key]}-${column.title}`}
                        >
                          <Controller
                            name={`${fieldName}-${column.key}-${index}`}
                            control={control}
                            defaultValue={item[column.key]}
                            render={({ field: { onChange, value } }) => (
                              <input
                                autoComplete="off"
                                id={fieldName}
                                type="checkbox"
                                className={`w-full h-full truncate peer focus:outline-none bg-transparent disabled:cursor-not-allowed border-0 text-sm ${
                                  item.icon ? 'pl-0' : ''
                                }`}
                                disabled={disabled}
                                placeholder={inputPlaceholder || ''}
                                checked={value}
                                onChange={(e) => {
                                  let finalValue = e
                                  if (onChangeModifier) {
                                    finalValue = onChangeModifier(finalValue)
                                  }
                                  e = finalValue
                                  onChange(e.target.value)
                                }}
                              />
                            )}
                          />
                        </td>
                      ) : column.type === 'password' ? (
                        <td
                          className={`py-2 text-sm font-medium text-gray-800  first:pr-4 last:pr-4 whitespace-nowrap first:sm:pl-6 last:sm:pr-6 dark:text-gray-100 ${
                            !disabled
                              ? 'bg-white dark:bg-darkmode-600'
                              : 'bg-gray-100 dark:bg-darkmode-800'
                          }`}
                          key={`${item[column.key]}-${column.title}`}
                        >
                          {item.icon ? (
                            <span className="pl-4">{item.icon}</span>
                          ) : undefined}
                          <Controller
                            name={`${fieldName}-${column.key}-${index}`}
                            control={control}
                            defaultValue={item[column.key]}
                            render={({ field: { onChange, value } }) => (
                              <input
                                autoComplete="off"
                                id={fieldName}
                                type={item?.inputType ?? 'text'}
                                className={`w-full h-full truncate peer focus:outline-none bg-transparent disabled:cursor-not-allowed border-0 text-sm ${
                                  item.icon ? 'pl-0' : 'px-2'
                                }`}
                                disabled={disabled}
                                placeholder={inputPlaceholder || ''}
                                value={value}
                                onChange={(e) => {
                                  let finalValue = e
                                  if (onChangeModifier) {
                                    finalValue = onChangeModifier(finalValue)
                                  }
                                  e = finalValue
                                  onChange(e.target.value)
                                }}
                              />
                            )}
                          />
                        </td>
                      ) : (
                        <td
                          className="py-2 pl-4 text-sm text-gray-500 bg-gray-100 dark:text-gray-300 dark:bg-darkmode-800 first:pr-4 last:pr-4 whitespace-nowrap first:sm:pl-6 last:sm:pr-6"
                          key={`${item[column.key]}-${column.title}`}
                        >
                          {item[column.key]}
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
