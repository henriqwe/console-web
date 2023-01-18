import * as common from 'common'
import * as consoleData from 'domains/console'
import * as utils from 'utils'
import * as services from 'services'
import { useState } from 'react'
import { CheckIcon } from '@heroicons/react/outline'
import * as UserContext from 'contexts/UserContext'
import { useRouter } from 'next/router'
import * as yup from 'yup'
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

export function AdminLogin() {
  const router = useRouter()

  const { user, setUser } = UserContext.useUser()
  const [loading, setLoading] = useState(false)
  const { setRoles, setOpenSlide } = consoleData.useUser()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        Password: yup.string().required()
      })
    )
  })

  async function onSubmit(formData: { Password: string }) {
    setLoading(true)

    try {
      const { data } = await services.ycodify.getRoles({
        password: formData.Password,
        username: `${
          utils.parseJwt(utils.getCookie('access_token') as string)?.username
        }@${router.query.name}`
      })

      setRoles(data)
      setUser({ ...user, adminSchemaPassword: formData.Password })
      reset()
      utils.notification('Authorized', 'success')
      setOpenSlide(false)
    } catch (error) {
      utils.showError(error)
      setUser({ ...user, adminSchemaPassword: undefined })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      className="flex flex-col gap-4 p-4"
      onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
    >
      <div className="flex flex-col">
        <span className="font-semibold">Username</span>
        {`${
          utils.parseJwt(utils.getCookie('access_token') as string)?.username
        }@${router.query.name}`}
      </div>
      <Controller
        name={'Password'}
        control={control}
        defaultValue={''}
        render={({ field: { onChange, value } }) => (
          <div className="w-full">
            <common.Input
              placeholder={'Password'}
              label="Password"
              type="password"
              value={value}
              onChange={onChange}
              errors={errors.Password}
            />
          </div>
        )}
      />
      <div className="flex justify-end">
        <common.Buttons.WhiteOutline
          disabled={loading}
          loading={loading}
          type="submit"
          icon={<CheckIcon className="w-3 h-3" />}
        >
          access
        </common.Buttons.WhiteOutline>
      </div>
    </form>
  )
}
