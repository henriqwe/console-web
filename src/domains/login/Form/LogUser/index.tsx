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
import router from 'next/router'

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
      onSubmit={handleSubmit(Submit as SubmitHandler<FieldValues>)}
      className="mt-10 flex flex-col gap-y-8"
    >
      <Controller
        name="userName"
        control={control}
        render={({ field: { onChange } }) => (
          <div className="w-full">
            <common.Input
              onChange={onChange}
              label="Nome de usuário"
              placeholder="Username"
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
            />
            {errors.userName && (
              <p className="text-sm text-red-500">{errors.userName.message}</p>
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
              onChange={onChange}
              label="Senha"
              placeholder="Password"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
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
      >
        <span className="text-white">
          Entrar <span aria-hidden="true">&rarr;</span>
        </span>
      </common.Buttons.Ycodify>
    </form>
  )
}
