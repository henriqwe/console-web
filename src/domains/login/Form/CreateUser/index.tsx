import * as common from 'common'
import * as utils from 'utils'
import * as login from 'domains/login'
import {
  useForm,
  FieldValues,
  SubmitHandler,
  Controller
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { routes } from 'domains/routes'

function isDarkTheme() {
  try {
    const theme = window.localStorage.getItem('theme')

    return theme === 'dark'
  } catch (error) {
    return false
  }
}

export function CreateUser() {
  const [loading, setLoading] = useState(false)
  const [isDark, setIsDark] = useState(isDarkTheme())
  const router = useRouter()
  const { setFormType, createUserSchema } = login.useLogin()
  const {
    formState: { errors },
    handleSubmit,
    control
  } = useForm({ resolver: yupResolver(createUserSchema) })

  async function Submit(formData: {
    userName: string
    password: string
    email: string
  }) {
    setLoading(true)
    try {
      const { data } = await utils.localApi.post(
        utils.apiRoutes.local.createAccount,
        {
          username: formData.userName,
          password: formData.password,
          email: formData.email
        }
      )
      utils.setCookie('access_token', data.data.access_token)
      utils.notification('User created successfully', 'success')
      router.push(routes.dashboard)
    } catch (err: any) {
      utils.showError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setIsDark(isDarkTheme())
  }, [])

  window.onstorage = function () {
    setIsDark(isDarkTheme())
  }

  return (
    <form
      className="flex flex-col items-center w-1/3 bg-white dark:bg-menu-primary dark:border-gray-500 border dark:text-text-primary rounded-lg"
      onSubmit={handleSubmit(Submit as SubmitHandler<FieldValues>)}
    >
      <div className="flex flex-col items-center w-full px-6 pt-6 rounded-lg">
        <div className="flex flex-col items-center mb-10">
          <img
            src={`/assets/images/${
              isDark ? 'logoTextLight' : 'logoTextDark'
            }.png`}
            alt="Logo"
            className="w-80"
          />
          <p>Web console</p>
        </div>

        <p className="text-gray-700 dark:text-text-primary">
          Register user here
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
                />
                {errors.userName && (
                  <p className="text-sm text-red-500">
                    {errors.userName.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field: { onChange } }) => (
              <div className="w-full">
                <common.Input
                  placeholder="Email"
                  className="w-full"
                  onChange={onChange}
                  type="email"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
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
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
            )}
          />

          <common.Buttons.Blue
            type="submit"
            loading={loading}
            disabled={loading}
          >
            Create user
          </common.Buttons.Blue>
        </div>
      </div>

      <div className="w-full border border-menuItem-secondary/50" />
      <p className="py-3 text-gray-700 dark:text-text-primary">
        Have an account?{' '}
        <span
          className="text-blue-500 cursor-pointer"
          onClick={() => setFormType('login')}
        >
          Log in!
        </span>
      </p>
    </form>
  )
}
