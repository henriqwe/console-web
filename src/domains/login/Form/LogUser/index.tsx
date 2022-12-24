import * as common from 'common'
import * as utils from 'utils'
import * as login from 'domains/login'
import * as yup from 'yup'
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

  const {
    formState: { errors },
    handleSubmit,
    control
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        userName: yup
          .string()
          .required('Username field is required')
          .test('equal', 'This field cannot contain spaces', (val) => {
            const validation = new RegExp(/\s/g)
            return !validation.test(val as string)
          })
          .test('equal', 'This field must contain only letters', (val) => {
            const validation = new RegExp(/^[A-Za-z ]*$/)
            return validation.test(val as string)
          }),
        password: yup.string().required('Password field is required')
      })
    )
  })

  async function Submit(formData: { userName: string; password: string }) {
    setLoading(true)
    try {
      const res = await signIn('credentials', {
        username: formData.userName,
        password: formData.password,
        redirect: false
      })
      if (res?.status === 401) {
        throw new Error('Ops! Incorrect username or password')
      }
      if (res?.ok && res?.status === 200) {
        return router.push(routes.dashboard)
      }
      throw new Error('Ops! Something went wrong')
    } catch (err: any) {
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
          <div className="flex flex-col w-full gap-y-2">
            <common.Input
              onChange={onChange}
              label="Username"
              placeholder="Username"
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              errors={errors.userName}
            />
          </div>
        )}
      />
      <div>
        <Controller
          name="password"
          control={control}
          render={({ field: { onChange } }) => (
            <div className="flex flex-col w-full gap-y-2">
              <common.Input
                onChange={onChange}
                label="Password"
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
        <Link href={'/change-password'}>
          <a className="text-sm font-medium text-blue-600 cursor-pointer dark:text-blue-400 hover:underline">
            Forgot password?
          </a>
        </Link>
      </div>

      <div className="flex justify-between">
        <a className=" w-max h-max" href="https://ycodify.com/">
          <common.Buttons.Clean
            iconPosition="left"
            icon={<ArrowLeftIcon className="w-4 h-4 dark:text-text-primary" />}
          >
            <p className="dark:text-text-primary">Go back</p>
          </common.Buttons.Clean>
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
