import axios from 'axios'
import * as common from 'common'
import * as utils from 'utils'
import * as dataContext from 'domains/console'
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
  const { logUserSchema } = dataContext.useUser()
  const {
    formState: { errors },
    handleSubmit,
    control
  } = useForm({ resolver: yupResolver(logUserSchema) })

  async function Submit(formData: { userName: string; password: string }) {
    setLoading(true)
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/adminLogin`,
        {
          username: formData.userName,
          password: formData.password
        }
      )
      utils.notification('Login successfully', 'success')
      utils.setCookie('admin_access_token', data.data.access_token)
      utils.setCookie('X-TenantID', data.data.username)
      router.push(routes.console + '/' + router.query.name)
    } catch (err: any) {
      if (err.response.status === 401) {
        return utils.notification(
          'Ops! Incorrect username or password',
          'error'
        )
      }
      utils.notification(err.message, 'error')
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
            <common.Button type="submit" loading={loading} disabled={loading}>
              Log in
            </common.Button>
          </div>
          <div className="w-full border" />
          <span
            className="text-blue-500 cursor-pointer py-3 text-sm"
            onClick={() => {
              router.push(routes.dashboard)
            }}
          >
            Back to dashboard
          </span>
        </div>
      </form>
    </div>
  )
}
