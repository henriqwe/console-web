import axios from 'axios'
import * as utils from 'utils'
import * as common from 'common'
import * as types from 'domains/console/types'
import * as consoleData from 'domains/console'
import { PencilIcon, XIcon, CheckIcon } from '@heroicons/react/outline'
import { Dispatch, ReactNode, SetStateAction, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'

type FormData = {
  comment?: string
  isIndex?: boolean
  isNullable?: boolean
  isUnique?: boolean
  name?: string
  length?: number
  type?: string
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
  const [activeFields, setActiveFields] = useState({
    Name: true,
    Type: true,
    Nullable: true,
    Unique: true,
    Index: true,
    Comment: true
  })
  const { fieldSchema, selectedTable, setReload, reload } =
    consoleData.useData()

  const {
    watch,
    formState: { errors },
    control
  } = useForm({ resolver: yupResolver(fieldSchema) })

  async function Save(formData: FormData) {
    await axios.put(
      `${process.env.NEXT_PUBLIC_YCODIFY_API_URL}/api/modeler/schema/${router.query.name}/entity/${selectedTable}/attribute/${data.name}`,
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${utils.getCookie('access_token')}`
        }
      }
    )
    setReload(!reload)
    utils.notification('attribute updated successfully', 'success')
    setShowDetails(false)
  }

  async function Remove() {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_YCODIFY_API_URL}/api/modeler/schema/${router.query.name}/entity/${selectedTable}/attribute/${data.name}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${utils.getCookie('access_token')}`
        }
      }
    )
    setReload(!reload)
    utils.notification('attribute updated successfully', 'success')
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
      <section className="flex flex-col gap-4 mt-4">
        <FormField
          title="Name"
          handleSubmit={() => Save({ name: watch('Name') })}
          setActiveFields={setActiveFields}
        >
          <Controller
            name="Name"
            defaultValue={data.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="flex-1">
                <common.Input
                  placeholder="Attribute name"
                  value={value}
                  onChange={onChange}
                  errors={errors.Name}
                  disabled={activeFields.Name}
                />
              </div>
            )}
          />
        </FormField>
        <FormField
          title="Type"
          handleSubmit={() =>
            Save({
              type: watch('Type').value,
              length:
                watch('Type').value === 'String' ? watch('Length') : undefined
            })
          }
          setActiveFields={setActiveFields}
        >
          <div className="flex items-center flex-1 gap-4">
            <div className="flex-1">
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
                    disabled={activeFields.Type}
                  />
                )}
              />
            </div>
            {(watch('Type') ? watch('Type').value : data.type) === 'String' && (
              <div className="flex-1">
                <Controller
                  name="Length"
                  defaultValue={data.length}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="flex-1">
                      <common.Input
                        placeholder="String length"
                        value={value}
                        onChange={onChange}
                        errors={errors.Length}
                        type="number"
                        disabled={activeFields.Type}
                      />
                    </div>
                  )}
                />
              </div>
            )}
          </div>
        </FormField>
        <FormField
          title="Nullable"
          handleSubmit={() => Save({ isNullable: watch('Nullable').value })}
          setActiveFields={setActiveFields}
        >
          <Controller
            name="Nullable"
            defaultValue={{
              name: data.isNullable ? 'True' : 'False',
              value: data.isNullable
            }}
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="flex-1">
                <common.Select
                  onChange={onChange}
                  value={value}
                  options={[
                    { name: 'True', value: true },
                    { name: 'False', value: false }
                  ]}
                  errors={errors.Nullable}
                  disabled={activeFields.Nullable}
                />
              </div>
            )}
          />
        </FormField>
        <FormField
          title="Unique"
          handleSubmit={() => Save({ isUnique: watch('Unique').value })}
          setActiveFields={setActiveFields}
        >
          <Controller
            name="Unique"
            defaultValue={{
              name: data.isUnique ? 'True' : 'False',
              value: data.isUnique
            }}
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="flex-1">
                <common.Select
                  onChange={onChange}
                  value={value}
                  options={[
                    { name: 'True', value: true },
                    { name: 'False', value: false }
                  ]}
                  errors={errors.Unique}
                  disabled={activeFields.Unique}
                />
              </div>
            )}
          />
        </FormField>
        <FormField
          title="Index"
          handleSubmit={() => Save({ isIndex: watch('Index').value })}
          setActiveFields={setActiveFields}
        >
          <Controller
            name="Index"
            defaultValue={{
              name: data.isIndex ? 'True' : 'False',
              value: data.isIndex
            }}
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="flex-1">
                <common.Select
                  onChange={onChange}
                  value={value}
                  options={[
                    { name: 'True', value: true },
                    { name: 'False', value: false }
                  ]}
                  errors={errors.Index}
                  disabled={activeFields.Index}
                />
              </div>
            )}
          />
        </FormField>
        <FormField
          title="Comment"
          handleSubmit={() => Save({ comment: watch('Comment') })}
          setActiveFields={setActiveFields}
        >
          <Controller
            name="Comment"
            defaultValue={data.comment}
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="flex-1">
                <common.Input
                  placeholder="Attribute comment"
                  onChange={onChange}
                  value={value}
                  errors={errors.Comment}
                  disabled={activeFields.Comment}
                />
              </div>
            )}
          />
        </FormField>
        <div className="flex gap-4 mt-4">
          <common.Button
            type="button"
            loading={false}
            disabled={false}
            color="red"
            onClick={() => setOpenModal(true)}
          >
            Remove attribute
          </common.Button>
        </div>
      </section>
      <common.Modal
        open={openModal}
        setOpen={setOpenModal}
        title={`Remove ${data.name} attribute?`}
        description={
          <>
            <p className="text-sm text-gray-600">
              Are you sure you want to remove this attribute?{' '}
            </p>
            <p className="text-sm font-bold text-gray-600">
              this action is irreversible!!!
            </p>
          </>
        }
        buttonTitle="Remove attribute"
        handleSubmit={Remove}
      />
    </common.Card>
  )
}

function FormField({
  children,
  title,
  handleSubmit,
  setActiveFields
}: {
  children: ReactNode
  title: string
  handleSubmit: () => Promise<void>
  setActiveFields: Dispatch<
    SetStateAction<{
      Name: boolean
      Type: boolean
      Nullable: boolean
      Unique: boolean
      Index: boolean
      Comment: boolean
    }>
  >
}) {
  const [activeEdit, setActiveEdit] = useState(false)
  return (
    <form
      className="grid w-full grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault()
        handleSubmit()
      }}
    >
      <p className="flex items-center content-center">{title}</p>
      <div className="flex items-center w-full gap-4">
        {children}
        {!activeEdit ? (
          <common.Button
            color="green"
            type="button"
            onClick={() => {
              setActiveFields((old) => {
                return {
                  ...old,
                  [title]: false
                }
              })
              setActiveEdit(true)
            }}
          >
            <div className="w-5 h-5">
              <PencilIcon />
            </div>
          </common.Button>
        ) : (
          <div className="flex gap-2">
            <common.Button
              color="red"
              type="button"
              onClick={() => {
                setActiveFields((old) => {
                  return {
                    ...old,
                    [title]: true
                  }
                })
                setActiveEdit(false)
              }}
            >
              <div className="w-5 h-5">
                <XIcon />
              </div>
            </common.Button>
            <common.Button color="green">
              <div className="w-5 h-5">
                <CheckIcon />
              </div>
            </common.Button>
          </div>
        )}
      </div>
    </form>
  )
}
