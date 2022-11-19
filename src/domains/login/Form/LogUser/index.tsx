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
import { signIn } from 'next-auth/react'
import { routes } from 'domains/routes'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/solid'
import router from 'next/router'
import Link from 'next/link'

export function LogUser() {
  const [loading, setLoading] = useState(false)
  const { logUserSchema } = login.useLogin()
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
      onSubmit={handleSubmit(Submit as SubmitHandler<FieldValues>)}
      className="flex flex-col mt-10 gap-y-8"
    >
      <Controller
        name="userName"
        control={control}
        render={({ field: { onChange } }) => (
          <div className="w-full flex flex-col gap-y-2">
            <common.Input
              onChange={onChange}
              label="Username"
              placeholder="Username"
              id="username"
              name="username"
              type="text"
              autoComplete="username"
            />
            {errors.userName && (
              <p className="text-sm text-red-500">{errors.userName.message}</p>
            )}
          </div>
        )}
      />
      <div>
        <Controller
          name="password"
          control={control}
          render={({ field: { onChange } }) => (
            <div className="w-full flex flex-col gap-y-2">
              <common.Input
                onChange={onChange}
                label="Password"
                placeholder="Password"
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          )}
        />
        <Link href={'/change-password'}>
          <a className="text-sm font-medium text-blue-600 cursor-pointer dark:text-blue-400 hover:underline">
            Forgot password?
          </a>
        </Link>
      </div>


      <div className='flex justify-between'>
      <a className=' w-max h-max '  href="https://ycodify.com/">
        <common.Buttons.Clean iconPosition='left' icon={<ArrowLeftIcon className='w-4 h-4'/>}>Go back</common.Buttons.Clean>  
        </a>
      <common.Buttons.Ycodify
        className="w-full md:w-max md:self-end"
        type="submit"
        loading={loading}
        disabled={loading}
        icon={<ArrowRightIcon className="w-5 h-5 text-white" />}
      >
        Login
      </common.Buttons.Ycodify>
      </div>


    </form>
  )
}
