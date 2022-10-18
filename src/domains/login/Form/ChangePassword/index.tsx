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

export function ChangePassword() {
  const [loading, setLoading] = useState(false)
  const [recoverStep, setRecoverStep] = useState(0)
  const router = useRouter()
  const { changePasswordSchema } = login.useLogin()
  const {
    formState: { errors },
    handleSubmit,
    control
  } = useForm({ resolver: yupResolver(changePasswordSchema(recoverStep)) })

  async function Submit(formData: { userName: string }) {
    setLoading(true)
    try {
      await utils.api.get(
        utils.apiRoutes.getUserHash({ username: formData.userName })
      )

      setRecoverStep(1)
      // utils.setCookie('access_token', data?.data?.access_token)
    } catch (err: any) {
      if (err?.response?.status === 417) {
        utils.notification('Username  already exists', 'error')
        return
      }
      utils.showError(err)
    } finally {
      setLoading(false)
    }
  }

  async function ValidateHash(formData: {
    userName: string
    recoverHash: string
    password: string
  }) {
    setLoading(true)
    try {
      await utils.api.post(utils.apiRoutes.changePassword, {
        username: formData.userName,
        password: formData.password,
        passwordRecoveryHash: formData.recoverHash
      })

      const res = await signIn('credentials', {
        username: formData.userName,
        password: formData.password,
        redirect: false
      })

      if (res?.ok && res?.status === 200) {
        router.push(routes.dashboard)
        utils.notification('Password changed successfully', 'success')
      }
    } catch (err: any) {
      utils.showError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(
        recoverStep === 0
          ? (Submit as SubmitHandler<FieldValues>)
          : (ValidateHash as SubmitHandler<FieldValues>)
      )}
      className="flex flex-col mt-10"
    >
      <Controller
        name="userName"
        control={control}
        render={({ field: { onChange } }) => (
          <div className="w-full">
            <common.Input
              onChange={onChange}
              label="Username to recover your password"
              placeholder="Username"
              id="username"
              name="username"
              type="text"
              disabled={recoverStep !== 0}
              autoComplete="username"
              required
            />
            {errors.userName && (
              <p className="text-sm text-red-500">{errors.userName.message}</p>
            )}
          </div>
        )}
      />
      {recoverStep === 0 ? (
        <common.Buttons.Ycodify
          className="w-full mt-4 md:w-max md:self-end"
          type="submit"
          loading={loading}
          disabled={loading}
          icon={<ArrowRightIcon className="w-5 h-5 text-white" />}
        >
          Confirm
        </common.Buttons.Ycodify>
      ) : (
        <div className="flex flex-col gap-4 my-4">
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange } }) => (
              <div className="w-full">
                <common.Input
                  onChange={onChange}
                  label="New Password"
                  placeholder="Password"
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="recoverHash"
            control={control}
            render={({ field: { onChange } }) => (
              <div className="w-full">
                <common.Input
                  onChange={onChange}
                  label="Recover hash"
                  placeholder="Recover hash"
                  id="recoverHash"
                  name="recoverHash"
                  type="text"
                  autoComplete="recoverHash"
                  required
                />
                {errors.userName && (
                  <p className="text-sm text-red-500">
                    {errors.userName.message}
                  </p>
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
            Validate
          </common.Buttons.Ycodify>
        </div>
      )}
    </form>
  )
}
