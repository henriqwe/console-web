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
import { useState } from 'react'
import * as ThemeContext from 'contexts/ThemeContext'
import { signIn } from 'next-auth/react'
import { routes } from 'domains/routes'
import router from 'next/router'

export function LogUser() {
  const { isDark } = ThemeContext.useTheme()
  const [loading, setLoading] = useState(false)
  const { setFormType, logUserSchema } = login.useLogin()
  const {
    formState: { errors },
    handleSubmit,
    control
  } = useForm({ resolver: yupResolver(logUserSchema) })

  async function Submit(formData: { userName: string; password: string }) {
    setLoading(true)
    try {
      const res = await signIn('credentials', {
        username: formData.userName,
        password: formData.password,
        redirect: false
      })
      if (res?.status === 401) {
        return utils.notification(
          'Ops! Incorrect username or password',
          'error'
        )
      }
      if (res?.ok && res?.status === 200) {
        utils.notification('Login successfully', 'success')
        router.push(routes.dashboard)
        return
      }
      return utils.notification('Ops! Something went wrong', 'error')
    } catch (err: any) {
      if (err.response?.status === 401) {
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
            Log in
          </common.Buttons.Blue>
        </div>
      </div>

      <div className="w-full border border-menuItem-secondary/50" />
      <p className="py-3 text-gray-700 dark:text-text-primary">
        Don&lsquo;t have an account?{' '}
        <span
          className="text-blue-500 cursor-pointer"
          onClick={() => setFormType('create')}
        >
          Sign up!
        </span>
      </p>
    </form>
  )
}
