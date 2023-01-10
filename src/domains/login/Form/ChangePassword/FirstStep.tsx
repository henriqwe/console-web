import { ArrowRightIcon, ReplyIcon } from '@heroicons/react/solid'
import * as common from 'common'
import * as utils from 'utils'
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
import * as services from 'services'

type FirstStepProps = {
  setRecoverStep: Dispatch<SetStateAction<number>>
  setUsername: Dispatch<SetStateAction<string>>
}

export function FirstStep({ setRecoverStep, setUsername }: FirstStepProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const {
    formState: { errors },
    handleSubmit,
    control
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        userName: yup.string().required('Username is required')
      })
    )
  })

  async function Submit(formData: { userName: string }) {
    setLoading(true)
    try {
      const res = await services.ycodify.getUserHash({
        userName: formData.userName
      })

      setRecoverStep(1)
      utils.notification('User found! check your email account', 'success')
      setUsername(formData.userName)
      // utils.setCookie('access_token', data?.data?.access_token)
    } catch (err: any) {
      utils.showError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(Submit as SubmitHandler<FieldValues>)}
      className="flex flex-col mt-6"
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
              errors={errors}
              autoComplete="username"
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
            router.push(routes.login)
          }}
        >
          Go back
        </common.Buttons.WhiteOutline>
        <common.Buttons.Ycodify
          className="w-full mt-4 md:w-max md:self-end"
          type="submit"
          loading={loading}
          disabled={loading}
          icon={<ArrowRightIcon className="w-5 h-5 text-white" />}
        >
          Confirm
        </common.Buttons.Ycodify>
      </div>
    </form>
  )
}
