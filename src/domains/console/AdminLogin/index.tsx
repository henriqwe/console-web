import * as common from 'common'
import * as utils from 'utils'
import * as yup from 'yup'
import * as services from 'services'

import {
  useForm,
  FieldValues,
  SubmitHandler,
  Controller
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { routes } from 'domains/routes'

export function AdminLogin() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const {
    formState: { errors },
    handleSubmit,
    control
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        userName: yup.string().required(),
        password: yup.string().required()
      })
    )
  })

  async function Submit(formData: { userName: string; password: string }) {
    try {
      setLoading(true)
      const { data } = await services.ycodify.adminLogin({
        username: formData.userName,
        password: formData.password
      })

      utils.notification('Login successfully', 'success')
      utils.setCookie('admin_access_token', data.data.access_token)
      utils.setCookie('X-TenantID', data.data.username)
      router.push(routes.console + '/' + router.query.name)
    } catch (err: any) {
      if (err?.response?.status === 401) {
        return utils.notification(
          'Ops! Incorrect username or password',
          'error'
        )
      }
      utils.showError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-[100vh] flex items-center justify-center bg-gray-100">
      <form
        className="flex flex-col items-center w-1/3 bg-white rounded-lg"
        onSubmit={handleSubmit(Submit as SubmitHandler<FieldValues>)}
      >
        <div className="flex flex-col items-center w-full px-6 pt-6 bg-white rounded-lg">
          <div className="flex flex-col items-center mb-10">
            <img
              src="/assets/images/logoTextDark.png"
              alt="Logo"
              className="w-80"
            />
            <p>Web console</p>
          </div>

          <p className="text-sm text-center">
            You need to log in to the admin account to access the web console!
          </p>

          <div className="flex flex-col w-full gap-4 my-4">
            <Controller
              name="userName"
              control={control}
              defaultValue={''}
              render={({ field: { onChange } }) => (
                <div className="w-full">
                  <common.Input
                    placeholder="User name"
                    className="w-full"
                    onChange={onChange}
                    errors={errors.username}
                  />
                </div>
              )}
            />
            <Controller
              name="password"
              control={control}
              defaultValue={''}
              render={({ field: { onChange } }) => (
                <div className="w-full">
                  <common.Input
                    placeholder="Password"
                    type="password"
                    className="w-full"
                    onChange={onChange}
                    errors={errors.password}
                  />
                </div>
              )}
            />
            <common.Buttons.Blue
              type="submit"
              loading={loading}
              disabled={loading}
            >
              Log in
            </common.Buttons.Blue>
          </div>
          <div className="w-full border" />
          <div
            className="flex items-center gap-2 py-3 text-sm text-gray-900 cursor-pointer hover:text-blue-500"
            onClick={() => {
              router.push(routes.dashboard)
            }}
          >
            <common.icons.ReturnIcon />
            <span>Back to dashboard</span>
          </div>
        </div>
      </form>
    </div>
  )
}
