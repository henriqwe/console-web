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
import * as services from 'services'
import { CheckIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import * as UserContext from 'contexts/UserContext'

export function AssociateAccount() {
  const [loading, setLoading] = useState(false)
  const { user } = UserContext.useUser()

  const router = useRouter()
  const { reload, setReload, setOpenSlide, roles } = consoleSection.useUser()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const onSubmit = async (formData: {
    Username: string
    Roles: { name: string; value: string }[]
  }) => {
    setLoading(true)
    try {
      if (!formData.Username) {
        throw new Error('Please enter a username')
      }
      const roles =
        formData?.Roles?.map(({ name }) => {
          return { name }
        }) || []

      await services.ycodify.updateAccountAndRole({
        password: user?.adminSchemaPassword as string,
        roles: roles,
        username: formData.Username,
        usernameAdmin: `${
          utils.parseJwt(utils.getCookie('access_token') as string)?.username
        }@${router.query.name}`
      })

      reset()
      setReload(!reload)
      setOpenSlide(false)
      setLoading(false)
      utils.notification('User created successfully', 'success')
    } catch (err: any) {
      utils.notification(err.response.data.message, 'error')
    } finally {
      setLoading(false)
    }
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
                label="User name"
                value={value}
                onChange={onChange}
                errors={errors.Username}
              />
            </div>
          )}
        />
      </div>
      <Controller
        name={'Roles'}
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => {
          return (
            <div className="w-full">
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
      <common.Separator />
      <common.Buttons.WhiteOutline
        disabled={loading}
        loading={loading}
        type="submit"
        icon={<CheckIcon className="w-4 h-4" />}
      >
        <div className="flex">Create</div>
      </common.Buttons.WhiteOutline>
    </form>
  )
}
