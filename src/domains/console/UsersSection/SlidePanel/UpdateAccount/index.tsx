import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form'
import { useState } from 'react'
import axios from 'axios'
import * as consoleSection from 'domains/console'
import * as common from 'common'
import * as utils from 'utils'
import { yupResolver } from '@hookform/resolvers/yup'

export function CreateAccount() {
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
    Email: string
    Active: { name: string; value: string }
    Roles: { name: string; value: string }
    Username: string
    Password: string
  }) => {
    setLoading(true)
    await axios
      .post(
        'https://api.ycodify.com/api/caccount/role',
        {
          defaultUse: formData.Roles.value,
          status: formData.Active.value
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-TenantID': utils.getCookie('X-TenantID') as string,
            Authorization: `Bearer ${utils.getCookie('admin_access_token')}`
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
          name={'Username'}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="flex-1">
              <common.Input
                placeholder={'User name'}
                value={value}
                onChange={onChange}
                errors={errors.Username}
              />
            </div>
          )}
        />

        <Controller
          name={'Email'}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="flex-1">
              <common.Input
                placeholder={'E-mail'}
                value={value}
                onChange={onChange}
                errors={errors.Email}
              />
            </div>
          )}
        />

        <Controller
          name={'Password'}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="flex-1">
              <common.Input
                placeholder={'Password'}
                value={value}
                onChange={onChange}
                errors={errors.Password}
                type="password"
              />
            </div>
          )}
        />
        <Controller
          name={'Active'}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="flex-1">
              <common.Select
                onChange={onChange}
                value={value}
                options={[
                  { name: 'Active', value: 1 },
                  { name: 'Suspended', value: 0 }
                ]}
                errors={errors.Active}
              />
            </div>
          )}
        />
      </div>
      <common.Separator />
      <common.Button disabled={loading} loading={loading}>
        <div className="flex">Create</div>
      </common.Button>
    </form>
  )
}
