import { RelationshipCard } from './RelationshipCard'
import * as utils from 'utils'
import * as common from 'common'
import * as types from 'domains/console/types'
import * as consoleSection from 'domains/console'
import { PlusIcon } from '@heroicons/react/outline'
import { SetStateAction, useState, Dispatch } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

type RelationshipTabProps = {
  loading: boolean
}

export function RelationshipTab({ loading }: RelationshipTabProps) {
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
    schemaTables
  } = consoleSection.useSchemaManager()

  async function RemoveTable() {
    try {
      setSubmitLoading(true)
      await utils.api.delete(
        `${utils.apiRoutes.entity(
          router.query.name as string
        )}/${selectedEntity}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        }
      )
      setReload(!reload)
      setSelectedEntity(undefined)
      utils.notification(
        `Table ${selectedEntity} deleted successfully`,
        'success'
      )
    } catch (err: any) {
      utils.notification(err.message, 'error')
    } finally {
      setSubmitLoading(false)
    }
  }

  // if (loading) {
  //   return (
  //     <div className="flex flex-col items-center justify-center w-full h-full mt-10">
  //       <div className="w-10 h-10">
  //         <common.Spinner />
  //       </div>
  //       <p>Loading...</p>
  //     </div>
  //   )
  // }

  return (
    <div
      className={`flex flex-col items-start rounded-b-md bg-white p-6 gap-2`}
    >
      <h3 className="text-lg">Entity relationships:</h3>

      <div className="flex justify-between w-full">
        <div className="flex-1 border border-y-0 border-x-0">
          <div className="px-4 py-2 bg-gray-100 border rounded-tl-xl">
            <p className="text-sm">Object relationships</p>
          </div>
          <RelationshipCard />
        </div>

        <div className="flex-1 border border-y-0 border-x-0">
          <div className="px-4 py-2 bg-gray-100 border rounded-tr-xl">
            <p className="text-sm">Array relationships</p>
          </div>
          <RelationshipCard />
        </div>
      </div>

      {openForm && (
        <>
          <common.Separator />
          <AttributeForm
            setOpenForm={setOpenForm}
            setReload={setReload}
            reload={reload}
            selectedEntity={selectedEntity}
            schemaTables={schemaTables}
            entityData={entityData}
          />
        </>
      )}
      <common.Separator />
      <div className="flex justify-end w-full gap-4 ">
        {!openForm && (
          <common.Buttons.Clean
            type="button"
            loading={false}
            disabled={false}
            onClick={() => setOpenForm(true)}
            icon={<PlusIcon className="w-3 h-3" />}
          >
            Add relationship
          </common.Buttons.Clean>
        )}
      </div>
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
              this action is irreversible!!!
            </p>
          </>
        }
        buttonTitle="Remove entity"
        handleSubmit={RemoveTable}
      />
    </div>
  )
}

function AttributeForm({
  setOpenForm,
  setReload,
  reload,
  selectedEntity,
  schemaTables,
  entityData
}: {
  setOpenForm: Dispatch<SetStateAction<boolean>>
  setReload: Dispatch<SetStateAction<boolean>>
  reload: boolean
  selectedEntity?: string
  schemaTables?: types.SchemaTable
  entityData?: types.EntityData[]
}) {
  const { relationshipSchema } = consoleSection.useSchemaManager()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const {
    control,
    watch,
    formState: { errors },
    handleSubmit
  } = useForm({ resolver: yupResolver(relationshipSchema) })

  async function Submit(data: any) {
    try {
      setLoading(true)
      if (!data.ColumnName || !data.Type) {
        throw new Error('Missing required fields')
      }

      if (data.Type.value === 'String' && !data.Length) {
        throw new Error('String length is required')
      }

      // await utils.api.post(
      //   utils.apiRoutes.attribute({
      //     projectName: router.query.name as string,
      //     entityName: selectedTable as string
      //   }),
      //   {
      //     name: data.ColumnName,
      //     comment: data.Comment,
      //     isNullable: data.Nullable || false,
      //     length: data.Length,
      //     type: data.Type.value
      //   },
      //   {
      //     headers: {
      //       'Content-Type': 'application/json',
      //       Authorization: `Bearer ${utils.getCookie('access_token')}`
      //     }
      //   }
      // )

      setReload(!reload)
      setOpenForm(false)
      utils.notification(
        `Attribute ${data.ColumnName} created successfully`,
        'success'
      )
    } catch (err: any) {
      console.log(err)
      utils.notification(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      className="flex flex-col w-full gap-4 px-4 py-5 bg-gray-100 border border-gray-300 rounded-lg"
      onSubmit={handleSubmit(Submit)}
    >
      <div className="flex items-center justify-between gap-4">
        <Controller
          name={'RelationshipName'}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="w-1/2">
              <common.Select
                options={
                  entityData
                    ? entityData.map((table) => {
                        return {
                          name: table.name,
                          value: table.name
                        }
                      })
                    : []
                }
                value={value}
                onChange={onChange}
                errors={errors.RelationshipName}
                label="Relationship name"
              />
            </div>
          )}
        />

        <Controller
          name={'ReferenceEntity'}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="w-1/2 pr-2">
              <common.Select
                options={Object.keys(schemaTables!).map((entity) => {
                  return {
                    name: entity,
                    value: entity
                  }
                })}
                value={value}
                label="Reference entity"
                placeholder="Reference entity"
                onChange={onChange}
                errors={errors.ReferenceEntity}
              />
            </div>
          )}
        />
      </div>

      <div className="flex items-center justify-between w-full col-span-2">
        <common.Buttons.White
          type="button"
          disabled={loading}
          onClick={() => setOpenForm(false)}
        >
          Close
        </common.Buttons.White>

        <common.Buttons.Yellow
          type="submit"
          loading={loading}
          disabled={loading}
          onClick={() => setOpenForm(true)}
        >
          Create
        </common.Buttons.Yellow>
      </div>
    </form>
  )
}
