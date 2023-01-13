import { AssociationCard } from './AssociationCard'
import * as utils from 'utils'
import * as common from 'common'
import * as yup from 'yup'
import * as services from 'services'
import * as types from 'domains/console/types'
import * as consoleSection from 'domains/console'
import { PlusIcon } from '@heroicons/react/outline'
import { SetStateAction, useState, Dispatch } from 'react'
import { useRouter } from 'next/router'
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

export function AssociationTab() {
  const [openForm, setOpenForm] = useState(false)
  const { selectedEntity, setReload, reload, setSelectedEntity, schemaTables } =
    consoleSection.useSchemaManager()

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
      className={`flex flex-col items-start rounded-b-md bg-white dark:bg-gray-800 p-6 gap-2`}
    >
      <div className="flex justify-between w-full gap-4 ">
        {!openForm && (
          <common.Buttons.WhiteOutline
            type="button"
            loading={false}
            disabled={false}
            onClick={() => setOpenForm(true)}
            icon={<PlusIcon className="w-3 h-3" />}
          >
            Add Association
          </common.Buttons.WhiteOutline>
        )}
      </div>
      <common.Separator />
      {Object.keys(schemaTables![selectedEntity as string])
        .filter((attribute) => {
          const entities = Object.keys(schemaTables!)
          return entities.includes(
            schemaTables![selectedEntity as string][attribute].type
          )
        })
        .map((attribute) => (
          <AssociationCard
            key={attribute}
            attribute={attribute}
            schemaTables={schemaTables!}
            selectedEntity={selectedEntity!}
          />
        ))}
      {Object.keys(schemaTables!)
        .map((entity) => {
          if (entity !== selectedEntity) {
            const attributes = Object.keys(schemaTables![entity])
            for (const attribute of attributes) {
              if (schemaTables![entity][attribute].type === selectedEntity) {
                return { attribute, entity }
              }
            }
          }
        })
        .filter((entity) => entity)
        .map(({ attribute, entity }: { attribute: string; entity: string }) => {
          return (
            <AssociationCard
              key={attribute}
              attribute={attribute}
              schemaTables={schemaTables!}
              selectedEntity={entity}
              noEdit
              reverse
            />
          )
        })}
      {/* <div className="flex justify-between w-full">
        <div className="flex-1 border border-y-0 border-x-0">
          <div className="px-4 py-2 bg-gray-100 border dark:bg-gray-700 dark:border-gray-600 rounded-tl-xl">
            <p className="text-sm">Object associations</p>
          </div>
        </div>

        <div className="flex-1 border border-y-0 border-x-0">
          <div className="px-4 py-2 bg-gray-100 border dark:bg-gray-700 dark:border-gray-600 rounded-tr-xl">
            <p className="text-sm">Array associations</p>
          </div> */}
      {/* <AssociationCard /> */}
      {/* </div>
      </div> */}
      {openForm && (
        <>
          <common.Separator />
          <AttributeForm
            setOpenForm={setOpenForm}
            setReload={setReload}
            reload={reload}
            selectedEntity={selectedEntity}
            schemaTables={schemaTables}
          />
        </>
      )}
    </div>
  )
}

function AttributeForm({
  setOpenForm,
  setReload,
  reload,
  selectedEntity,
  schemaTables
}: {
  setOpenForm: Dispatch<SetStateAction<boolean>>
  setReload: Dispatch<SetStateAction<boolean>>
  reload: boolean
  selectedEntity?: string
  schemaTables?: types.SchemaTable
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        AssociationName: yup.string().required('This field is required'),
        ReferenceEntity: yup
          .object()
          .test('empty', 'This field is required', (val) => !!val.value)
          .required('This field is required')
      })
    )
  })

  async function Submit(data: {
    AssociationName: string
    ReferenceEntity: {
      name: string
      value: unknown
    }
    Comment?: string
    Nullable?: boolean
  }) {
    try {
      setLoading(true)

      await services.ycodify.createAssociation({
        accessToken: utils.getCookie('access_token') as string,
        Comment: data.Comment as string,
        name: data.AssociationName,
        type: data.ReferenceEntity.name,
        Nullable: data.Nullable || false,
        projectName: router.query.name as string,
        selectedEntity: selectedEntity as string
      })

      setReload(!reload)
      setOpenForm(false)
      utils.notification(
        `Association ${data.AssociationName} created successfully`,
        'success'
      )
    } catch (err: any) {
      utils.showError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      className="flex flex-col w-full gap-4 px-4 py-5 bg-gray-100 border border-gray-300 rounded-lg dark:bg-menu-primary dark:border-gray-600"
      onSubmit={handleSubmit(Submit as SubmitHandler<FieldValues>)}
    >
      <div className="flex items-center justify-between gap-4">
        <Controller
          name={'AssociationName'}
          control={control}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <div className="w-1/3">
              <common.Input
                placeholder="Association name"
                className="w-full"
                onChange={onChange}
                errors={errors.AssociationName}
                label="Association name"
              />
            </div>
          )}
        />

        <Controller
          name={'ReferenceEntity'}
          control={control}
          defaultValue={{}}
          render={({ field: { onChange, value } }) => (
            <div className="w-1/3 pr-2">
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

        <Controller
          name={'Comment'}
          control={control}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <div>
              <common.Input
                placeholder="Comment"
                value={value}
                onChange={onChange}
                errors={errors.Comment}
                label="Comment"
              />
            </div>
          )}
        />

        <Controller
          name={'Nullable'}
          control={control}
          render={({ field: { onChange } }) => (
            <div className="flex items-center gap-2 mt-7">
              <input type="checkbox" id={'Nullable'} onChange={onChange} />
              <label htmlFor={'Nullable'}>Nullable</label>
            </div>
          )}
        />
      </div>

      <div className="flex items-center justify-between w-full col-span-2">
        <common.Buttons.WhiteOutline
          type="button"
          disabled={loading}
          onClick={() => setOpenForm(false)}
        >
          Close
        </common.Buttons.WhiteOutline>

        <common.Buttons.YellowOutline
          type="submit"
          loading={loading}
          disabled={loading}
          onClick={() => setOpenForm(true)}
        >
          Create
        </common.Buttons.YellowOutline>
      </div>
    </form>
  )
}
