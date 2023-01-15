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
import { yupResolver } from '@hookform/resolvers/yup'
import { CheckIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import * as UserContext from 'contexts/UserContext'

export function CreateRole() {
  const router = useRouter()
  const { user } = UserContext.useUser()

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
  }) => {
    setLoading(true)
    try {
      await services.ycodify.createRole({
        Name: formData.Name,
        password: user?.adminSchemaPassword as string,
        Status: formData.Active.value,
        username: `${
          utils.parseJwt(utils.getCookie('access_token') as string)?.username
        }@${router.query.name}`,
        XTenantID: utils.getCookie('X-TenantID') as string
      })
      reset()
      setReload(!reload)
      setOpenSlide(false)
      utils.notification('Operation performed successfully', 'success')
    } catch (err: any) {
      if (err.response.status === 417)
        utils.notification('Role name must be unique', 'error')
      else
        utils.notification(
          `Ops! Something went wrong: ${err.response.data.message}`,
          'error'
        )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form data-testid="editForm" className="flex flex-col items-end">
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
                  { name: 'Suspended', value: 0 },
                  { name: 'Active', value: 1 }
                ]}
                errors={errors.Active}
              />
            </div>
          )}
        />
      </div>
      <common.Separator />
      <common.Buttons.WhiteOutline
        icon={<CheckIcon className="w-3 h-3" />}
        disabled={loading}
        loading={loading}
        type="button"
        onClick={() => handleSubmit(onSubmit as SubmitHandler<FieldValues>)()}
      >
        <div className="flex">Create</div>
      </common.Buttons.WhiteOutline>
    </form>
  )
}
