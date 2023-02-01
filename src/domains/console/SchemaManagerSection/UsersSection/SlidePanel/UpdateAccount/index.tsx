import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form'
import { useEffect, useState } from 'react'
import * as consoleSection from 'domains/console'
import * as common from 'common'
import { yupResolver } from '@hookform/resolvers/yup'
import { CheckIcon } from '@heroicons/react/outline'
import * as utils from 'utils'
import { useRouter } from 'next/router'
import * as yup from 'yup'
import * as UserContext from 'contexts/UserContext'
import * as services from 'services'

export function UpdateAccount() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user } = UserContext.useUser()
  const { reload, setReload, setOpenSlide, selectedUser, roles } =
    consoleSection.useUser()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        Active: yup.object().required(),
        Roles: yup.array().min(1, 'Select at least one role').required()
      })
    )
  })

  const onSubmit = async (formData: {
    Email: string
    Active: { name: string; value: number }
    Roles: { name: string; value: string }[]
    Username: string
  }) => {
    setLoading(true)
    try {
      const roles = formData?.Roles?.map(({ name }) => {
        return { name }
      })

      await services.ycodify.updateUser({
        adminUsername: `${
          utils.parseJwt(utils.getCookie('access_token')!)?.username
        }@${router.query.name}`,
        password: user?.adminSchemaPassword as string,
        roles: roles,
        status: formData.Active.value,
        username: selectedUser?.username as string,
        XTenantID: utils.getCookie('X-TenantID') as string
      })

      reset()
      setReload(!reload)
      setOpenSlide(false)
      utils.notification('Operation performed successfully', 'success')
    } catch (err) {
      setLoading(false)
      utils.showError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const userRoles =
      selectedUser?.roles?.map((role) => {
        return { name: role.name, value: role.name }
      }) || []
    setValue('Roles', userRoles)
  }, [selectedUser])

  return (
    <form
      onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
      className="flex flex-col items-end"
    >
      <div className="flex flex-col w-full gap-2 mb-2">
        <Controller
          name={'Userame'}
          control={control}
          defaultValue={selectedUser?.username}
          render={({ field: { onChange, value } }) => (
            <div className="flex-1">
              <common.Input
                placeholder={'Username'}
                label={'Username'}
                value={value}
                onChange={onChange}
                disabled
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
                label={'E-mail'}
                value={value}
                onChange={onChange}
                disabled
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
          defaultValue={[]}
          render={({ field: { onChange, value } }) => {
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
                  errors={errors.Roles}
                />
              </div>
            )
          }}
        />
      </div>
      <common.Separator />
      <common.Buttons.WhiteOutline
        disabled={loading}
        loading={loading}
        type="submit"
        icon={<CheckIcon className="w-4 h-4" />}
      >
        Update
      </common.Buttons.WhiteOutline>
    </form>
  )
}
