import * as utils from 'utils'
import * as common from 'common'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import * as consoleSection from 'domains/console'
import axios from 'axios'
import { useRouter } from 'next/router'

export function CreateTable() {
  const router = useRouter()
  const { setShowCreateTableSection, setReload, reload } =
    consoleSection.useData()
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch
  } = useForm()
  const [columnsGroup, setColumnsGroup] = useState<number[]>([1])
  const [lastNumber, setLastNumber] = useState(0)
  const [loading, setLoading] = useState(false)
  const [reloadFields, setReloadFields] = useState(false)

  async function Submit(data: any) {
    try {
      setLoading(true)

      const filteredData = columnsGroup.filter((column) => column !== 0)
      const columnValues = filteredData.map((column) => {
        if (!data['ColumnName' + column] || !data['Type' + column]) {
          return
        }

        if (
          data['Type' + column].value === 'String' &&
          !data['Length' + column]
        ) {
          return null
        }

        return {
          ColumnName: data['ColumnName' + column],
          Type: data['Type' + column].value,
          Comment: data['Comment' + column],
          Nullable: data['Nullable' + column],
          Length: data['Length' + column]
        }
      })

      if (columnValues.includes(undefined)) {
        throw new Error('Missing required fields')
      }

      if (columnValues.includes(null)) {
        throw new Error('String length is required')
      }

      await axios.post(
        `https://api.ycodify.com/api/modeler/schema/${router.query.name}/entity`,
        {
          name: data.Name
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        }
      )

      for (const column of columnValues) {
        await axios.post(
          `https://api.ycodify.com/api/modeler/schema/${router.query.name}/entity/${data.Name}/attribute`,
          {
            name: column?.ColumnName,
            comment: column?.Comment,
            isNullable: column?.Nullable || false,
            length: column?.Length,
            type: column?.Type.value
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${utils.getCookie('access_token')}`
            }
          }
        )
      }

      setReload(!reload)
      setShowCreateTableSection(false)
      utils.notification(`Schema ${data.Name} created successfully`, 'success')
    } catch (err: any) {
      console.log(err)
      utils.notification(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

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
              <div className="grid grid-cols-11 gap-4 py-5" key={column}>
                <Controller
                  name={'ColumnName' + column}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="col-span-3">
                      <common.Input
                        placeholder="Column name"
                        value={value}
                        onChange={onChange}
                        errors={errors.ColumnName}
                      />
                    </div>
                  )}
                />

                <Controller
                  name={'Type' + column}
                  defaultValue={{ name: 'String', value: 'String' }}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="col-span-2">
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

                {watch('Type' + column)?.name === 'String' && (
                  <Controller
                    name={'Length' + column}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <div className="col-span-2">
                        <common.Input
                          placeholder="String Length"
                          value={value}
                          onChange={onChange}
                          errors={errors.Length}
                        />
                      </div>
                    )}
                  />
                )}

                <Controller
                  name={'Comment' + column}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div
                      className={
                        watch('Type' + column)?.name === 'String'
                          ? 'col-span-2'
                          : 'col-span-4'
                      }
                    >
                      <common.Input
                        placeholder="Comment"
                        value={value}
                        onChange={onChange}
                        errors={errors.Comment}
                      />
                    </div>
                  )}
                />

                <Controller
                  name={'Nullable' + column}
                  control={control}
                  render={({ field: { onChange } }) => (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={'Nullable' + column}
                        onChange={onChange}
                      />
                      <label htmlFor={'Nullable' + column}>Nullable</label>
                    </div>
                  )}
                />

                <div className="flex items-start justify-center">
                  {column !== 1 && (
                    <common.Button
                      onClick={() => {
                        columnsGroup[index] = 0
                        setReloadFields(!reloadFields)
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
          <div className="mt-4">
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
          <common.Button
            className="py-2 cursor-pointer"
            onClick={handleSubmit(Submit)}
            loading={loading}
            disabled={loading}
          >
            Create table
          </common.Button>
        </div>
      </div>
    </common.Card>
  )
}
