import * as common from 'common'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

export function CreateTable() {
  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm()
  const [columnsGroup, setColumnsGroup] = useState<number[]>([1])
  const [lastNumber, setLastNumber] = useState(0)
  const [loading, setLoading] = useState(false)
  const [reload, setReload] = useState(false)

  useEffect(() => {
    if (columnsGroup[columnsGroup.length - 1] > lastNumber) {
      setLastNumber(columnsGroup[columnsGroup.length - 1])
    }
  }, [columnsGroup, lastNumber])

  return (
    <common.Card className="flex flex-col h-full">
      <div className="flex items-center w-full px-4 bg-gray-200 border-gray-300 rounded-t-lg min-h-[4rem] border-x gap-2">
        <p className="text-lg font-bold text-gray-700">Create a new table</p>
      </div>

      <div className={`flex flex-col h-full px-6 pt-5 bg-white rounded-b-lg`}>
        <Controller
          name="Name"
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="mb-2">
              <common.Input
                placeholder="Table name"
                label="Table name"
                value={value}
                onChange={onChange}
                errors={errors.Name}
              />
            </div>
          )}
        />
        <common.Separator />

        <p>Columns</p>

        {columnsGroup.map(
          (column, index) =>
            column !== 0 && (
              <div className="grid grid-cols-12 gap-4 py-5">
                <div className="col-span-4">
                  <Controller
                    name={'ColumnName' + column}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <div>
                        <common.Input
                          placeholder="Column name"
                          value={value}
                          onChange={onChange}
                          errors={errors.ColumnName}
                        />
                      </div>
                    )}
                  />
                </div>

                <Controller
                  name={'Type' + column}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="col-span-4">
                      <common.Select
                        options={[
                          { name: 'String', value: 'String' },
                          { name: 'Integer', value: 'Integer' },
                          { name: 'Long', value: 'Long' },
                          { name: 'Boolean', value: 'Boolean' },
                          { name: 'Double', value: 'Double' },
                          { name: 'Timestamp', value: 'Timestamp' }
                        ]}
                        value={value}
                        onChange={onChange}
                      />
                    </div>
                  )}
                />

                <div className="flex col-span-3 gap-3">
                  <Controller
                    name={'Nullable' + column}
                    control={control}
                    render={({ field: { onChange } }) => (
                      <div className="flex items-center col-span-2 gap-2">
                        <input
                          type="checkbox"
                          id={'Nullable' + column}
                          onChange={onChange}
                        />
                        <label htmlFor={'Nullable' + column}>Nullable</label>
                      </div>
                    )}
                  />

                  <Controller
                    name={'Unique' + column}
                    control={control}
                    render={({ field: { onChange } }) => (
                      <div className="flex items-center col-span-1 gap-2">
                        <input
                          type="checkbox"
                          id={'Unique' + column}
                          onChange={onChange}
                        />
                        <label htmlFor={'Unique' + column}>Unique</label>
                      </div>
                    )}
                  />
                  <Controller
                    name={'Index' + column}
                    control={control}
                    render={({ field: { onChange } }) => (
                      <div className="flex items-center col-span-1 gap-2">
                        <input
                          type="checkbox"
                          id={'Index' + column}
                          onChange={onChange}
                        />
                        <label htmlFor={'Index' + column}>Index</label>
                      </div>
                    )}
                  />
                </div>

                <div className="flex items-start justify-center">
                  {column !== 1 && (
                    <common.Button
                      onClick={() => {
                        columnsGroup[index] = 0
                        setReload(!reload)
                      }}
                      type="button"
                      color={'red'}
                      className="h-full"
                    >
                      <common.icons.DeleteIcon className={`w-5 h-5`} />
                    </common.Button>
                  )}
                </div>
              </div>
            )
        )}

        {!loading && (
          <div className="mt-2">
            <common.Button
              className="py-2 cursor-pointer"
              onClick={() => {
                setColumnsGroup([...columnsGroup, lastNumber + 1])
              }}
            >
              Add another column
            </common.Button>
          </div>
        )}

        <common.Separator />
        <div className="flex items-end justify-end w-full">
          <common.Button className="py-2 cursor-pointer" onClick={() => {}}>
            Create table
          </common.Button>
        </div>
      </div>
    </common.Card>
  )
}
