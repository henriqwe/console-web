import { Column } from './Column'
import * as utils from 'utils'
import * as common from 'common'
import * as services from 'services'
import * as consoleSection from 'domains/console'
import { XIcon, PlusIcon, TrashIcon } from '@heroicons/react/outline'
import { SetStateAction, useState, Dispatch, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

type ModifyTabProps = {
  loading: boolean
}

export function ModifyTab({ loading }: ModifyTabProps) {
  const router = useRouter()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const {
    entityData,
    selectedEntity,
    setReload,
    reload,
    setSelectedEntity,
    schemaTables,
    privateAttributes,
    setColumnNames
  } = consoleSection.useSchemaManager()

  async function RemoveEntity() {
    try {
      setSubmitLoading(true)
      console.log({
        accessToken: utils.getCookie('access_token') as string,
        name: router.query.name as string,
        selectedEntity: selectedEntity as string
      })
      await services.ycodify.deleteEntity({
        accessToken: utils.getCookie('access_token') as string,
        name: router.query.name as string,
        selectedEntity: selectedEntity as string
      })

      setSelectedEntity(undefined)
      utils.notification(
        `Entity ${selectedEntity} deleted successfully`,
        'success'
      )
    } catch (err: any) {
      utils.showError(err)
    } finally {
      setReload(!reload)
      setSubmitLoading(false)
    }
  }

  useEffect(() => {
    const columnNames = entityData
      ?.filter((data) => {
        const entities = Object.keys(schemaTables!)
        if (entities.includes(data.type)) {
          return false
        }
        return data.name !== '_conf' && !privateAttributes.includes(data.name)
      })
      .map((data) => data.name)

    setColumnNames(columnNames ?? [])
  }, [schemaTables])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full mt-10">
        <div className="w-10 h-10">
          <common.Spinner />
        </div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div
      className={`flex flex-col ${
        loading ? 'items-center justify-center' : 'items-start'
      } rounded-b-md bg-white dark:bg-gray-800 p-6 gap-2`}
    >
      <div className="flex flex-row-reverse justify-between w-full gap-4 ">
        <common.Buttons.RedOutline
          type="button"
          loading={submitLoading}
          disabled={submitLoading}
          onClick={() => setOpenModal(true)}
          icon={<TrashIcon className="w-4 h-4" />}
        >
          Remove entity
        </common.Buttons.RedOutline>
        {!openForm && (
          <common.Buttons.WhiteOutline
            type="button"
            loading={false}
            disabled={false}
            onClick={() => setOpenForm(true)}
            icon={<PlusIcon className="w-3 h-3" />}
          >
            Add attribute
          </common.Buttons.WhiteOutline>
        )}
      </div>
      <common.Separator />
      <div className="flex flex-col gap-6 mt-4">
        <div className="flex flex-col gap-2">
          <span className="text-gray-600 dark:text-text-primary font-semibold text-lg">
            Ycodify control attributes
          </span>
          <Column key={'id'} data={idColumnData} noEdit />
          {entityData
            ?.filter((data) => {
              const entities = Object.keys(schemaTables!)
              if (entities.includes(data.type)) {
                return false
              }
              return (
                data.name !== '_conf' && privateAttributes.includes(data.name)
              )
            })
            .map((data) => (
              <Column key={data.name} data={data} noEdit />
            ))}
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-gray-600 dark:text-text-primary font-semibold text-lg">
            Entity attributes
          </span>
          {entityData
            ?.filter((data) => {
              const entities = Object.keys(schemaTables!)
              if (entities.includes(data.type)) {
                return false
              }
              return (
                data.name !== '_conf' && !privateAttributes.includes(data.name)
              )
            })
            .map((data) => (
              <Column key={data.name} data={data} />
            ))}
        </div>
      </div>

      {openForm && (
        <AttributeForm
          setOpenForm={setOpenForm}
          setReload={setReload}
          reload={reload}
          selectedEntity={selectedEntity}
        />
      )}

      <common.Modal
        open={openModal}
        setOpen={setOpenModal}
        loading={submitLoading}
        disabled={submitLoading}
        title={`Remove ${selectedEntity} entity?`}
        description={
          <>
            <p className="text-sm text-gray-600">
              Are you sure you want to remove this entity?{' '}
            </p>
            <p className="text-sm font-bold text-gray-600">
              This action is irreversible
            </p>
          </>
        }
        buttonTitle="Remove entity"
        handleSubmit={RemoveEntity}
      />
    </div>
  )
}

function AttributeForm({
  setOpenForm,
  setReload,
  reload,
  selectedEntity
}: {
  setOpenForm: Dispatch<SetStateAction<boolean>>
  setReload: Dispatch<SetStateAction<boolean>>
  reload: boolean
  selectedEntity?: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { addAttributeSchema } = consoleSection.useSchemaManager()
  const {
    control,
    watch,
    formState: { errors },
    handleSubmit
  } = useForm({
    resolver: yupResolver(addAttributeSchema)
  })

  async function Submit(data: any) {
    try {
      setLoading(true)

      await services.ycodify.createAttribute({
        accessToken: utils.getCookie('access_token') as string,
        ColumnName: data.ColumnName,
        Comment: data.Comment,
        entityName: selectedEntity as string,
        Length: data.Length,
        Nullable: data.Nullable || false,
        projectName: router.query.name as string,
        Type: data.Type.value
      })

      setReload(!reload)
      setOpenForm(false)
      utils.notification(
        `Attribute ${data.ColumnName} created successfully`,
        'success'
      )
    } catch (err: any) {
      console.log(err)
      utils.showError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      className="grid grid-cols-12 gap-4 px-4 py-5 bg-white border border-gray-300 rounded-lg dark:bg-menu-primary"
      onSubmit={handleSubmit(Submit)}
    >
      <Controller
        name={'ColumnName'}
        control={control}
        render={({ field: { onChange, value } }) => (
          <div className="col-span-3 w-full flex flex-col gap-y-2">
            <common.Input
              placeholder="Column name"
              value={value}
              onChange={onChange}
            />
            {errors.ColumnName && (
              <p className="text-sm text-red-500">
                {errors.ColumnName.message}
              </p>
            )}
          </div>
        )}
      />

      <Controller
        name={'Type'}
        control={control}
        render={({ field: { onChange, value } }) => (
          <div className="col-span-2 w-full flex flex-col gap-y-2">
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
              placeholder="Type"
            />
            {errors.Type && (
              <p className="text-sm text-red-500">{errors.Type.message}</p>
            )}
          </div>
        )}
      />

      {watch('Type')?.name === 'String' && (
        <Controller
          name={'Length'}
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
        name={'Comment'}
        control={control}
        render={({ field: { onChange, value } }) => (
          <div
            className={
              watch('Type')?.name === 'String' ? 'col-span-2' : 'col-span-4'
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
        name={'Nullable'}
        control={control}
        render={({ field: { onChange } }) => (
          <div className="flex items-center gap-2">
            <input type="checkbox" id={'Nullable'} onChange={onChange} />
            <label htmlFor={'Nullable'}>Nullable</label>
          </div>
        )}
      />

      <div className="flex items-center justify-around w-full col-span-2">
        <common.Buttons.RedOutline
          type="button"
          disabled={loading}
          onClick={() => setOpenForm(false)}
        >
          <XIcon className="w-5 h-5 " />
        </common.Buttons.RedOutline>

        <common.Buttons.GreenOutline
          type="submit"
          loading={loading}
          disabled={loading}
          onClick={() => setOpenForm(true)}
        >
          <PlusIcon className="w-5 h-5 " />
        </common.Buttons.GreenOutline>
      </div>
    </form>
  )
}

const idColumnData = {
  name: 'id',
  comment: 'metadata controller by YCodify platform',
  nullable: false,
  unique: true,
  isIndex: false,
  length: 0,
  createdAt: 0,
  type: 'Integer'
}
