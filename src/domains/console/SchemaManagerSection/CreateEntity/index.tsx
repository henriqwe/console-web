import * as utils from 'utils'
import * as common from 'common'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import * as consoleSection from 'domains/console'
import { useRouter } from 'next/router'
import { PlusIcon, CheckIcon } from '@heroicons/react/outline'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

export function CreateEntity() {
  const router = useRouter()
  const {
    setShowCreateEntitySection,
    setReload,
    reload,
    breadcrumbPages,
    setColumnNames,
    columnNames
  } = consoleSection.useSchemaManager()
  const [columnsGroup, setColumnsGroup] = useState<number[]>([1])
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch
  } = useForm({
    resolver: yupResolver(createEntitySchema())
  })
  const [lastNumber, setLastNumber] = useState(0)
  const [loading, setLoading] = useState(false)
  const [reloadFields, setReloadFields] = useState(false)

  function createEntitySchema() {
    let shape = {
      Name: yup
        .string()
        .required('Entity name is required')
        .test('equal', 'Entity name must contain only letters', (val) => {
          const validation = new RegExp(/^[A-Za-z ]*$/)
          return validation.test(val as string)
        })
        .test('equal', 'Entity name cannot contain spaces', (val) => {
          const validation = new RegExp(/\s/g)
          return !validation.test(val as string)
        })
    }

    for (const col of columnsGroup.filter((col) => col !== 0)) {
      shape = {
        ...shape,
        [`ColumnName${col}`]: yup
          .string()
          .required('Column name is required')
          .test('equal', 'Column cannot contain spaces', (val) => {
            const validation = new RegExp(/\s/g)
            return !validation.test(val as string)
          })
          .test('equal', 'Column name must contain only letters', (val) => {
            const validation = new RegExp(/^[A-Za-z ]*$/)
            return validation.test(val as string)
          })
          .test('equal', 'Column name must be unique', (val) => {
            if (
              columnNames
                .filter((col) => col !== '0' && col !== undefined)
                .filter((col) => col === val).length > 1
            ) {
              return false
            }
            return true
          }),
        [`Type${col}`]: yup.object(),
        [`Length${col}`]: yup
          .number()
          .typeError('Length must be a number')
          .nullable()
          .moreThan(-1, 'Length must be positive')
          .transform((_, val) => (val !== '' ? Number(val) : null)),
        [`Comment${col}`]: yup.string()
      }
    }

    return yup.object().shape(shape)
  }

  async function Submit(data: any) {
    try {
      setLoading(true)
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

      const columnValues = []
      for (const column of filteredData) {
        columnValues.push({
          name: data['ColumnName' + column],
          type: data['Type' + column].value,
          comment: data['Comment' + column] || '',
          nullable: data['Nullable' + column] || false,
          length: data['Length' + column] ?? 0
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

  useEffect(() => {
    setColumnNames([])
  }, [])

  return (
    <common.Card className="flex flex-col w-full h-full">
      <div className="flex w-full h-[3.3rem]">
        <common.Breadcrumb pages={breadcrumbPages} />
      </div>
      <common.ContentSection variant="WithoutTitleBackgroundColor">
        <div
          className={`flex flex-col h-auto p-6 gap-y-2 bg-white dark:bg-menu-primary rounded-lg`}
          data-testid="main"
        >
          <Controller
            name="Name"
            control={control}
            defaultValue={''}
            render={({ field: { onChange, value } }) => (
              <div className="relative flex-col flex-1 mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-text-primary">
                  Entity name
                </label>
                <common.Input
                  placeholder="Entity name"
                  value={value}
                  onChange={onChange}
                  className={`${
                    errors['Name'] ? 'ring-red-500 ring-2 rounded-md' : ''
                  }`}
                  errors={errors['Name']}
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
                          data-testid="remove column"
                          onClick={() => {
                            columnsGroup[index] = 0
                            setReloadFields(!reloadFields)

                            setColumnNames((old) => {
                              const array = [...old]
                              array[column] = '0'

                              return array
                            })
                          }}
                        />
                      )}
                    </div>
                    <Controller
                      name={`ColumnName${column}`}
                      control={control}
                      defaultValue={''}
                      render={({ field: { onChange } }) => (
                        <div className="relative flex-col flex-1">
                          <common.Input
                            name={`ColumnName${column}`}
                            placeholder="Column name"
                            onChange={(e) => {
                              onChange(e.target.value)
                              setColumnNames((old) => {
                                const array = [...old]
                                array[column] = e.target.value

                                return array
                              })
                            }}
                            className={`${
                              errors[`ColumnName${column}`]
                                ? 'ring-red-500 ring-2 rounded-md'
                                : ''
                            }`}
                            errors={errors[`ColumnName${column}`]}
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
                      <div className="relative col-span-2">
                        <common.Select
                          options={[
                            { name: 'String', value: 'String' },
                            { name: 'Text', value: 'Text' },
                            { name: 'Integer', value: 'Integer' },
                            { name: 'Long', value: 'Long' },
                            { name: 'Boolean', value: 'Boolean' },
                            { name: 'Double', value: 'Double' },
                            { name: 'Timestamp', value: 'Timestamp' }
                          ]}
                          value={value}
                          onChange={onChange}
                          errors={errors[`Type${column}`]}
                        />
                      </div>
                    )}
                  />

                  {watch('Type' + column)?.name === 'String' && (
                    <Controller
                      name={'Length' + column}
                      control={control}
                      defaultValue={''}
                      render={({ field: { onChange, value } }) => (
                        <div className="relative col-span-2">
                          <common.Input
                            placeholder="String Length"
                            value={value}
                            onChange={onChange}
                            errors={errors[`Length${column}`]}
                            className={`${
                              errors[`Length${column}`]
                                ? 'ring-red-500 ring-2 rounded-md'
                                : ''
                            }`}
                          />
                        </div>
                      )}
                    />
                  )}

                  <Controller
                    name={'Comment' + column}
                    control={control}
                    defaultValue={''}
                    render={({ field: { onChange, value } }) => (
                      <div
                        className={
                          watch('Type' + column)?.name === 'String'
                            ? 'col-span-2'
                            : 'col-span-4'
                        }
                        data-testid="comment"
                      >
                        <common.Input
                          placeholder="Comment"
                          value={value}
                          onChange={onChange}
                          errors={errors[`Comment${column}`]}
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
                          className="cursor-pointer"
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
                <common.Buttons.WhiteOutline
                  onClick={() => {
                    setColumnsGroup([...columnsGroup, lastNumber + 1])
                  }}
                  loading={loading}
                  disabled={loading}
                  icon={<PlusIcon className="w-3 h-3" />}
                >
                  Add column
                </common.Buttons.WhiteOutline>
              )}
            </div>
            <common.Buttons.WhiteOutline
              onClick={handleSubmit(Submit)}
              loading={loading}
              disabled={loading}
              icon={<CheckIcon className="w-3 h-3" />}
            >
              Create entity
            </common.Buttons.WhiteOutline>
          </div>
        </div>
      </common.ContentSection>
    </common.Card>
  )
}
