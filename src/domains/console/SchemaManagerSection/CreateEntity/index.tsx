import * as utils from 'utils'
import * as common from 'common'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import * as consoleSection from 'domains/console'
import { useRouter } from 'next/router'
import { PlusIcon, CheckIcon } from '@heroicons/react/outline'

export function CreateEntity() {
  const router = useRouter()
  const { setShowCreateEntitySection, setReload, reload, breadcrumbPages } =
    consoleSection.useSchemaManager()
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
      const validation = new RegExp(/^[A-Za-z ]*$/)
      if (!validation.test(data.Name)) {
        throw new Error('Entity name must contain only letters')
      }

      const spaceValidation = new RegExp(/\s/g)
      if (spaceValidation.test(data.Name)) {
        throw new Error('Entity cannot contain spaces')
      }
      // const response = await utils.api
      //   .get(`${utils.apiRoutes.schemas}/${router.query.name}`, {
      //     headers: {
      //       'Content-Type': 'application/json',
      //       Accept: 'application/json',
      //       Authorization: `Bearer ${utils.getCookie('access_token')}`
      //     }
      //   })
      //   .catch(() => null)

      // const tables = Object.keys(response ? response.data.data : {})
      // if (tables.includes(data.Name.toLowerCase())) {
      //   throw new Error(`Entity ${data.Name} already exists`)
      // }

      const filteredData = columnsGroup.filter((column) => column !== 0)
      const names: string[] = []

      const columnValues = []
      for (const column of filteredData) {
        if (!data['ColumnName' + column] || !data['Type' + column]) {
          throw new Error('Missing required fields')
        }
        if (!validation.test(data['ColumnName' + column])) {
          throw new Error('Column name must contain only letters')
        }

        if (spaceValidation.test(data['ColumnName' + column])) {
          throw new Error('Column cannot contain spaces')
        }

        if (
          data['Type' + column].value === 'String' &&
          !data['Length' + column]
        ) {
          throw new Error('String length is required')
        }

        if (names.includes(data['ColumnName' + column].toLowerCase())) {
          throw new Error('Cannot create entity with duplicated column name')
        }

        names.push(data['ColumnName' + column])

        columnValues.push({
          name: data['ColumnName' + column],
          type: data['Type' + column].value,
          comment: data['Comment' + column] || '',
          nullable: data['Nullable' + column] || false,
          length: data['Length' + column]
        })
      }

      await utils.api.post(
        utils.apiRoutes.entity(router.query.name as string),
        {
          name: data.Name,
          attributes: columnValues,
          associations: []
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        }
      )

      // for (const column of columnValues) {
      //   await utils.api.post(
      //     utils.apiRoutes.attribute({
      //       entityName: data.Name,
      //       projectName: router.query.name as string
      //     }),
      //     {
      //       name: column?.name,
      //       comment: column?.comment,
      //       isNullable: column?.isNullable || false,
      //       length: column?.length,
      //       type: column?.type.value
      //     },
      //     {
      //       headers: {
      //         'Content-Type': 'application/json',
      //         Authorization: `Bearer ${utils.getCookie('access_token')}`
      //       }
      //     }
      //   )
      // }

      setReload(!reload)
      setShowCreateEntitySection(false)
      utils.notification(`Entity ${data.Name} created successfully`, 'success')
    } catch (err: any) {
      console.log(err)
      utils.showError(err)
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
    <common.Card className="flex flex-col w-full h-full">
      <div className="flex w-full h-[3.3rem]">
        <common.Breadcrumb pages={breadcrumbPages} />
      </div>
      <common.ContentSection variant="WithoutTitleBackgroundColor">
        <div className={`flex flex-col h-auto p-6  bg-white rounded-lg`}>
          <Controller
            name="Name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="mb-2">
                <common.Input
                  placeholder="Entity name"
                  label="Entity name"
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
                <div className="grid grid-cols-12 gap-4 py-2" key={column}>
                  <div className="flex items-center col-span-3 gap-2">
                    <div className="w-5 h-5">
                      {column !== 1 && (
                        <common.icons.XIcon
                          className="text-red-500 hover:cursor-pointer"
                          onClick={() => {
                            columnsGroup[index] = 0
                            setReloadFields(!reloadFields)
                          }}
                        />
                      )}
                    </div>
                    <Controller
                      name={'ColumnName' + column}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <div className="flex-1">
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
                </div>
              )
          )}
          <common.Separator />
          <div className="flex items-end justify-between w-full">
            <div>
              {!loading && (
                <common.Buttons.Clean
                  onClick={() => {
                    setColumnsGroup([...columnsGroup, lastNumber + 1])
                  }}
                  loading={loading}
                  disabled={loading}
                  icon={<PlusIcon className="w-3 h-3" />}
                >
                  Add column
                </common.Buttons.Clean>
              )}
            </div>
            <common.Buttons.Clean
              onClick={handleSubmit(Submit)}
              loading={loading}
              disabled={loading}
              icon={<CheckIcon className="w-3 h-3" />}
            >
              Create entity
            </common.Buttons.Clean>
          </div>
        </div>
      </common.ContentSection>
    </common.Card>
  )
}
