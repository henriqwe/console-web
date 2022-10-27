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
import { useState } from 'react'
import { routes } from 'domains/routes'
import { ArrowRightIcon } from '@heroicons/react/solid'
import { signIn } from 'next-auth/react'
import * as yup from 'yup'
import { usePixel } from 'contexts/PixelContext'

export function CreateUser() {
  const { pixel } = usePixel()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { createUserSchema } = login.useLogin()
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
      await utils.localApi.post(utils.apiRoutes.local.createAccount, {
        username: formData.userName,
        password: formData.password,
        email: formData.email
      })

      const res = await signIn('credentials', {
        username: formData.userName,
        password: formData.password,
        redirect: false
      })

      if (res?.ok && res?.status === 200) {
        pixel.track('Lead')

        router.push(routes.dashboard)
        return
      }
      // utils.setCookie('access_token', data?.data?.access_token)
      utils.notification('User created successfully', 'success')
      router.push(routes.dashboard)
    } catch (err: any) {
      if (err?.response?.status === 417) {
        utils.notification('Username already exists', 'error')
        return
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

      <Controller
        name="email"
        control={control}
        render={({ field: { onChange } }) => (
          <div className="w-full flex flex-col gap-y-2">
            <common.Input
              onChange={onChange}
              label="E-mail"
              placeholder="E-mail"
              id="email"
              name="email"
              type="text"
              autoComplete="email"
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
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
        )}
      />

      <common.Buttons.Ycodify
        className="w-full md:w-max md:self-end"
        type="submit"
        loading={loading}
        disabled={loading}
        icon={<ArrowRightIcon className="w-5 h-5 text-white" />}
      >
        Register
      </common.Buttons.Ycodify>
    </form>
  )
}
