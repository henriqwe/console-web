import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form'
import { useEffect, useState } from 'react'
import * as consoleSection from 'domains/console'
import * as common from 'common'
import * as utils from 'utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { CheckIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import * as UserContext from 'contexts/UserContext'

const options = [
  { name: 'Suspended', value: 0 },
  { name: 'Active', value: 1 },
  { name: 'Canceled', value: 2 }
]
export function UpdateRole() {
  const router = useRouter()
  const { user } = UserContext.useUser()

  const [loading, setLoading] = useState(false)
  const { roleSchema, reload, setReload, setOpenSlide, slideData } =
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
    await utils.api
      .post(
        utils.apiRoutes.updateRole,
        {
          username: `${
            utils.parseJwt(utils.getCookie('access_token'))?.username
          }@${router.query.name}`,
          password: user?.adminSchemaPassword,
          role: {
            name: formData.Name,
            status: formData.Active.value
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-TenantID': utils.getCookie('X-TenantID') as string
          }
        }
      )
      .then(() => {
        reset()
        setReload(!reload)
        setOpenSlide(false)
        utils.notification('Operation performed successfully', 'success')
      })
      .catch((err) => {
        utils.notification(err.message, 'error')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    reset({
      Name: slideData?.name
    })
  }, [slideData])
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
                label={'Name'}
                value={value}
                onChange={onChange}
                errors={errors.Name}
                disabled
              />
            </div>
          )}
        />
        <Controller
          name={'Active'}
          control={control}
          defaultValue={
            options.filter((option) => option.value === slideData?.status)[0]
          }
          render={({ field: { onChange, value } }) => (
            <div className="flex-1">
              <common.Select
                onChange={onChange}
                value={value}
                label="Status"
                options={options}
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
        <div className="flex">Update</div>
      </common.Buttons.WhiteOutline>
    </form>
  )
}
