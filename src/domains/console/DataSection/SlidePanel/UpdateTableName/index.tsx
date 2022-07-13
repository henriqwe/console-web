import { Controller, useForm } from 'react-hook-form'
import { useState } from 'react'
import axios from 'axios'
import * as consoleData from 'domains/console'
import * as common from 'common'
import * as utils from 'utils'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'

export function UpdateTableName() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { setOpenSlide, setReload, reload, selectedTable, setSelectedTable } =
    consoleData.useData()

  const yupSchema = yup.object().shape({ Name: yup.string().required() })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: yupResolver(yupSchema) })

  const onSubmit = async (formData: any) => {
    try {
      setLoading(true)
      await axios.put(
        `${process.env.NEXT_PUBLIC_YCODIFY_API_URL}/api/modeler/schema/${router.query.name}/entity/${selectedTable}`,
        {
          name: formData.Name
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        }
      )

      reset()
      setSelectedTable(formData.Name)
      setReload(!reload)
      setOpenSlide(false)
      setLoading(false)
      utils.notification('Operation performed successfully', 'success')
    } catch (err: any) {
      utils.notification(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="editForm"
      className="flex flex-col items-end"
    >
      <div className="flex flex-col w-full gap-2 mb-2">
        <Controller
          name="Name"
          defaultValue={selectedTable}
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
      </div>
      <common.Separator />
      <common.Button disabled={loading} loading={loading}>
        <div className="flex">Update</div>
      </common.Button>
    </form>
  )
}
