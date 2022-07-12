import { Column } from './Column'
import * as utils from 'utils'
import * as common from 'common'
import * as consoleSection from 'domains/console'
import { XIcon, PlusIcon } from '@heroicons/react/outline'
import { SetStateAction, useState, Dispatch } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'

type ModifyTabProps = {
  loading: boolean
}

export function ModifyTab({ loading }: ModifyTabProps) {
  const router = useRouter()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const { tableData, selectedTable, setReload, reload, setSelectedTable } =
    consoleSection.useData()

  async function RemoveTable() {
    try {
      setSubmitLoading(true)
      await axios.delete(
        `${process.env.NEXT_PUBLIC_YCODIFY_API_URL}/api/modeler/schema/${router.query.name}/entity/${selectedTable}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        }
      )
      setReload(!reload)
      setSelectedTable(undefined)
      utils.notification(
        `Table ${selectedTable} deleted successfully`,
        'success'
      )
    } catch (err: any) {
      utils.notification(err.message, 'error')
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <div
      className={`flex flex-col ${
        loading ? 'items-center justify-center' : 'items-start'
      } h-full bg-gray-100 p-6 rounded-b-lg gap-2`}
    >
      <h3 className="text-lg">Columns:</h3>
      {tableData?.map((data) => (
        <Column key={data.name} data={data} />
      ))}

      {openForm && (
        <AttributeForm
          setOpenForm={setOpenForm}
          setReload={setReload}
          reload={reload}
          selectedTable={selectedTable}
        />
      )}
      <common.Separator />
      <div className="flex justify-between w-full gap-4 mt-4">
        <common.Button
          type="button"
          loading={submitLoading}
          disabled={submitLoading}
          color="red-outline"
          onClick={() => setOpenModal(true)}
        >
          Remove table
        </common.Button>

        {!openForm && (
          <common.Button
            type="button"
            loading={false}
            disabled={false}
            onClick={() => setOpenForm(true)}
          >
            Add attribute
          </common.Button>
        )}
      </div>
      <common.Modal
        open={openModal}
        setOpen={setOpenModal}
        loading={submitLoading}
        disabled={submitLoading}
        title={`Remove ${selectedTable} table?`}
        description={
          <>
            <p className="text-sm text-gray-600">
              Are you sure you want to remove this table?{' '}
            </p>
            <p className="text-sm font-bold text-gray-600">
              this action is irreversible!!!
            </p>
          </>
        }
        buttonTitle="Remove table"
        handleSubmit={RemoveTable}
      />
    </div>
  )
}

function AttributeForm({
  setOpenForm,
  setReload,
  reload,
  selectedTable
}: {
  setOpenForm: Dispatch<SetStateAction<boolean>>
  setReload: Dispatch<SetStateAction<boolean>>
  reload: boolean
  selectedTable?: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const {
    control,
    watch,
    formState: { errors },
    handleSubmit
  } = useForm()

  async function Submit(data: any) {
    try {
      setLoading(true)
      if (!data.ColumnName || !data.Type) {
        throw new Error('Missing required fields')
      }

      if (data.Type.value === 'String' && !data.Length) {
        throw new Error('String length is required')
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_YCODIFY_API_URL}/api/modeler/schema/${router.query.name}/entity/${selectedTable}/attribute`,
        {
          name: data.ColumnName,
          comment: data.Comment,
          isNullable: data.Nullable || false,
          length: data.Length,
          type: data.Type.value
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        }
      )

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
      className="grid grid-cols-12 gap-4 px-4 py-5 bg-white border border-gray-300 rounded-lg"
      onSubmit={handleSubmit(Submit)}
    >
      <Controller
        name={'ColumnName'}
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
        name={'Type'}
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
        <common.Button
          type="button"
          disabled={loading}
          color="red"
          onClick={() => setOpenForm(false)}
        >
          <XIcon className="w-5 h-5 text-white" />
        </common.Button>

        <common.Button
          type="submit"
          color="green"
          loading={loading}
          disabled={loading}
          onClick={() => setOpenForm(true)}
        >
          <PlusIcon className="w-5 h-5 text-white" />
        </common.Button>
      </div>
    </form>
  )
}
