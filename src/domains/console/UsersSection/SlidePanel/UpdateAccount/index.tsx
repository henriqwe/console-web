import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form'
import { useEffect, useState } from 'react'
import axios from 'axios'
import * as consoleSection from 'domains/console'
import * as common from 'common'
import * as utils from 'utils'
import { yupResolver } from '@hookform/resolvers/yup'

export function UpdateAccount() {
  const [loading, setLoading] = useState(false)
  const {
    updateUserSchema,
    reload,
    setReload,
    setOpenSlide,
    selectedUser,
    roles,
    setRoles
  } = consoleSection.useUser()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: yupResolver(updateUserSchema) })

  const onSubmit = async (formData: {
    Email: string
    Active: { name: string; value: string }
    Roles: { name: string; value: string }[]
    Username: string
  }) => {
    setLoading(true)
    await axios
      .put(
        `https://api.ycodify.com/api/account/account/username/${selectedUser?.username}/version/${selectedUser?.version}`,
        {
          status: formData.Active.value,
          email: formData.Email,
          roles: formData.Roles,
          username: formData.Username
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-TenantID': utils.getCookie('X-TenantID') as string,
            Authorization: `Bearer ${utils.getCookie('admin_access_token')}`,
            Accept: 'application/json'
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

  async function loadData() {
    try {
      const { data } = await axios.get(
        `https://api.ycodify.com/api/caccount/role`,
        {
          headers: {
            'X-TenantID': utils.getCookie('X-TenantID') as string,
            Accept: 'application/json',
            Authorization: `Bearer ${utils.getCookie('admin_access_token')}`
          }
        }
      )
      setRoles(data)
    } catch (err: any) {
      console.log(err)
      if (err.response.status !== 404) {
        utils.notification(err.message, 'error')
      }
    }
  }

  useEffect(() => {
    loadData()
  }, [])

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
          defaultValue={selectedUser?.username}
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
          defaultValue={selectedUser?.email}
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
          name={'Active'}
          control={control}
          defaultValue={{
            name: selectedUser?.status === 1 ? 'Active' : 'Suspended',
            value: selectedUser?.status
          }}
          render={({ field: { onChange, value } }) => (
            <div className="flex-1">
              <common.Select
                onChange={onChange}
                label="Status"
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
        <Controller
          name={'Roles'}
          control={control}
          defaultValue={selectedUser?.roles.map((role) => {
            return { name: role.name, value: role.name }
          })}
          render={({ field: { onChange, value } }) => {
            console.log('value', value)
            return (
              <div className="flex-1">
                <common.MultiSelect
                  onChange={onChange}
                  value={value}
                  label="Roles"
                  options={
                    roles?.map((role) => {
                      return {
                        name: role.name,
                        value: role.name
                      }
                    }) || []
                  }
                  edit
                  errors={errors.Active}
                />
              </div>
            )
          }}
        />
      </div>
      <common.Separator />
      <common.Button disabled={loading} loading={loading}>
        <div className="flex">Update</div>
      </common.Button>
    </form>
  )
}
