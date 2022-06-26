import axios from 'axios'
import * as utils from 'utils'
import * as common from 'common'
import * as types from 'domains/console/types'
import * as consoleData from 'domains/console'
import { Dispatch, SetStateAction, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'

type FormData = {
  Name: string
  Type: SelectValue
  Nullable: SelectValue
  Unique: SelectValue
  Index: SelectValue
  Comment: string
}

type SelectValue = {
  name: any
  value: any
}

export function FieldDetail({
  data,
  setShowDetails
}: {
  data: types.TableData
  setShowDetails: Dispatch<SetStateAction<boolean>>
}) {
  const router = useRouter()
  const [openModal, setOpenModal] = useState(false)
  const { fieldSchema, selectedTable, setReload, reload } =
    consoleData.useData()

  const {
    handleSubmit,
    formState: { errors },
    control
  } = useForm({ resolver: yupResolver(fieldSchema) })

  async function Save(formData: FormData) {
    await axios.put(
      `https://api.ycodify.com/api/modeler/schema/${router.query.name}/entity/${selectedTable}/attribute/${data.name}`,
      {
        comment: formData.Comment,
        createdAt: 1653612544841,
        isIndex: formData.Index.value,
        isNullable: formData.Nullable.value,
        isUnique: formData.Unique.value,
        // name: formData.Name,
        type: formData.Type.value
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${utils.getCookie('access_token')}`
        }
      }
    )
    setReload(!reload)
    utils.notification('field updated successfully', 'success')
    setShowDetails(false)
  }

  async function Remove() {
    await axios.delete(
      `https://api.ycodify.com/api/modeler/schema/${router.query.name}/entity/${selectedTable}/attribute/${data.name}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${utils.getCookie('access_token')}`
        }
      }
    )
    setReload(!reload)
    utils.notification('field updated successfully', 'success')
    setShowDetails(false)
  }

  return (
    <common.Card className="p-6 bg-white border border-gray-300">
      <div className="flex gap-4">
        <button
          className="px-1 py-1 text-sm bg-white border border-gray-300 rounded-md"
          type="button"
          onClick={() => setShowDetails(false)}
        >
          Close
        </button>
        <p className="font-bold">{data.name}</p>
      </div>
      <form
        className="flex flex-col gap-4 mt-4"
        onSubmit={handleSubmit((formData) => Save(formData as FormData))}
      >
        {/* <div className="grid w-full grid-cols-2">
          <p className="flex items-center content-center">Name</p>
          <Controller
            name="Name"
            defaultValue={data.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <common.Input
                placeholder="field name"
                value={value}
                onChange={onChange}
                errors={errors.Name}
              />
            )}
          />
        </div> */}
        <div className="grid w-full grid-cols-2">
          <p className="flex items-center content-center">Type</p>
          <Controller
            name="Type"
            defaultValue={{ name: data.type, value: data.type }}
            control={control}
            render={({ field: { onChange, value } }) => (
              <common.Select
                onChange={onChange}
                value={value}
                options={[
                  { name: 'String', value: 'String' },
                  { name: 'Integer', value: 'Integer' },
                  { name: 'Long', value: 'Long' },
                  { name: 'Boolean', value: 'Boolean' },
                  { name: 'Double', value: 'Double' },
                  { name: 'Timestamp', value: 'Timestamp' }
                ]}
                errors={errors.Type}
              />
            )}
          />
        </div>
        <div className="grid w-full grid-cols-2">
          <p className="flex items-center content-center">Nullable</p>
          <Controller
            name="Nullable"
            defaultValue={{
              name: data.isNullable ? 'True' : 'False',
              value: data.isNullable
            }}
            control={control}
            render={({ field: { onChange, value } }) => (
              <common.Select
                onChange={onChange}
                value={value}
                options={[
                  { name: 'True', value: true },
                  { name: 'False', value: false }
                ]}
                errors={errors.Nullable}
              />
            )}
          />
        </div>
        <div className="grid w-full grid-cols-2">
          <p className="flex items-center content-center">Unique</p>
          <Controller
            name="Unique"
            defaultValue={{
              name: data.isUnique ? 'True' : 'False',
              value: data.isUnique
            }}
            control={control}
            render={({ field: { onChange, value } }) => (
              <common.Select
                onChange={onChange}
                value={value}
                options={[
                  { name: 'True', value: true },
                  { name: 'False', value: false }
                ]}
                errors={errors.Unique}
              />
            )}
          />
        </div>
        <div className="grid w-full grid-cols-2">
          <p className="flex items-center content-center">Index</p>
          <Controller
            name="Index"
            defaultValue={{
              name: data.isIndex ? 'True' : 'False',
              value: data.isIndex
            }}
            control={control}
            render={({ field: { onChange, value } }) => (
              <common.Select
                onChange={onChange}
                value={value}
                options={[
                  { name: 'True', value: true },
                  { name: 'False', value: false }
                ]}
                errors={errors.Index}
              />
            )}
          />
        </div>
        <div className="grid w-full grid-cols-2">
          <p className="flex items-center content-center">Comment</p>
          <Controller
            name="Comment"
            defaultValue={data.comment}
            control={control}
            render={({ field: { onChange, value } }) => (
              <common.Input
                placeholder="field name"
                onChange={onChange}
                value={value}
                errors={errors.Comment}
              />
            )}
          />
        </div>
        <div className="flex gap-4 mt-4">
          <common.Button
            type="submit"
            loading={false}
            disabled={false}
            color="yellow"
          >
            Save
          </common.Button>
          <common.Button
            type="button"
            loading={false}
            disabled={false}
            color="red"
            onClick={() => setOpenModal(true)}
          >
            Remove
          </common.Button>
        </div>
      </form>
      <common.Modal
        open={openModal}
        setOpen={setOpenModal}
        title={`Remove ${data.name} field?`}
        description={
          <>
            <p className="text-sm text-gray-600">
              Are you sure you want to remove this field?{' '}
            </p>
            <p className="text-sm font-bold text-gray-600">
              this action is irreversible!!!
            </p>
          </>
        }
        buttonTitle="Remove field"
        handleSubmit={Remove}
      />
    </common.Card>
  )
}
