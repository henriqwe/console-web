import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form'
import { useState } from 'react'
import * as consoleSection from 'domains/console'
import * as common from 'common'
import * as utils from 'utils'
import { yupResolver } from '@hookform/resolvers/yup'

export function CreateRole() {
  const [loading, setLoading] = useState(false)
  const { roleSchema, reload, setReload, setOpenSlide } =
    consoleSection.useUser()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: yupResolver(roleSchema) })

  const onSubmit = async (formData: {
    Name: string
    Active: { name: string; value: string }
    Default: { name: string; value: string }
  }) => {
    setLoading(true)
    await utils.api
      .post(
        utils.apiRoutes.roles,
        {
          name: formData.Name,
          defaultUse: formData.Default.value,
          status: formData.Active.value
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-TenantID': utils.getCookie('X-TenantID') as string,
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        }
      )
      .then(() => {
        reset()
        setReload(!reload)
        setOpenSlide(false)
        setLoading(false)
        utils.notification('Operation performed successfully', 'success')
      })
      .catch((err) => {
        utils.notification(err.message, 'error')
      })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
      data-testid="editForm"
      className="flex flex-col items-end"
    >
      <div className="flex flex-col w-full gap-2 mb-2">
        <Controller
          name={'Name'}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="flex-1">
              <common.Input
                placeholder={'Name'}
                value={value}
                onChange={onChange}
                errors={errors.Name}
              />
            </div>
          )}
        />
        <Controller
          name={'Active'}
          control={control}
          defaultValue={{ name: 'Active', value: 1 }}
          render={({ field: { onChange, value } }) => (
            <div className="flex-1">
              <common.Select
                onChange={onChange}
                value={value}
                label="Status"
                options={[
                  { name: 'Active', value: 1 },
                  { name: 'Suspended', value: 0 }
                ]}
                errors={errors.Active}
              />
            </div>
          )}
        />
        <Controller
          name={'Default'}
          control={control}
          defaultValue={{ name: 'Yes', value: true }}
          render={({ field: { onChange, value } }) => (
            <div className="flex-1">
              <common.Select
                onChange={onChange}
                value={value}
                label="Default"
                options={[
                  { name: 'Yes', value: true },
                  { name: 'No', value: false }
                ]}
                errors={errors.Default}
              />
            </div>
          )}
        />
      </div>
      <common.Separator />
      <common.Buttons.Blue disabled={loading} loading={loading}>
        <div className="flex">Create</div>
      </common.Buttons.Blue>
    </form>
  )
}
