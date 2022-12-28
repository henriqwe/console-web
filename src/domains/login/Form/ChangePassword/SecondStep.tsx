import { ArrowRightIcon, ReplyIcon } from '@heroicons/react/solid'
import * as common from 'common'
import * as utils from 'utils'
import * as login from 'domains/login'
import * as yup from 'yup'
import { routes } from 'domains/routes'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useState } from 'react'
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { signIn } from 'next-auth/react'

type SecondStepProps = {
  setRecoverStep: Dispatch<SetStateAction<number>>
  username: string
}

export function SecondStep({ setRecoverStep, username }: SecondStepProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const {
    formState: { errors },
    handleSubmit,
    control
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        userName: yup.string().required('Username is required'),
        password: yup
          .string()
          .required('Password is required')
          .min(6, 'Password must be at least 6 characters'),
        recoverHash: yup.string().required('Recover Hash is required')
      })
    )
  })

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
      onSubmit={handleSubmit(ValidateHash as SubmitHandler<FieldValues>)}
      className="flex flex-col mt-6"
    >
      <p className="mb-4 text-xs text-green-500">
        Account found! We sent an email with a hash code to validate a new
        password. Be aware that the hash code is valid for 72 hours.
      </p>
      <Controller
        name="userName"
        defaultValue={username}
        control={control}
        render={({ field: { onChange } }) => (
          <div className="w-full">
            <common.Input
              onChange={onChange}
              value={username}
              label="Username to recover your password"
              placeholder="Username"
              id="username"
              name="username"
              type="text"
              disabled
              autoComplete="username"
              errors={errors.userName}
            />
          </div>
        )}
      />
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
                errors={errors.password}
              />
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
                errors={errors.recoverHash}
              />
            </div>
          )}
        />

        <div className="flex justify-between w-full">
          <common.Buttons.WhiteOutline
            className="w-full md:w-max md:self-end"
            type="button"
            disabled={loading}
            icon={
              <ReplyIcon className="w-3 h-3 text-gray-800 dark:text-text-primary" />
            }
            onClick={() => {
              setRecoverStep(0)
            }}
          >
            Go back
          </common.Buttons.WhiteOutline>
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
      </div>
    </form>
  )
}
