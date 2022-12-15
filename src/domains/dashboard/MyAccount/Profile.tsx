import React, { useState } from 'react'
import * as Common from 'common'
import * as utils from 'utils'
import * as yup from 'yup'
import { useUser } from 'contexts/UserContext'
import { ChevronRightIcon } from '@heroicons/react/solid'
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Error from 'next/error'

type formDataType = {
  oldPassword: string
  password: string
  passwordConfirmation: string
}

export function Profile() {
  const { user } = useUser()
  const { username, email } = user?.userData || {}
  const {
    formState: { errors },
    handleSubmit,
    control
  } = useForm({ resolver: yupResolver(passwordSchema) })

  const [loading, setLoading] = useState(false)

  function Submit(formData: formDataType) {
    setLoading(true)

    utils.api
      .post(
        utils.apiRoutes.changePassword,
        {
          username,
          password: formData.password,
          oldPassword: formData.oldPassword
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      .then((res) => {
        if (res.status === 200) {
          utils.notification('Password changed successfully!', 'success')
        } else {
          console.log('res', res)
          utils.notification(res.data.message, 'error')
        }
      })
      .finally(() => setLoading(false))
      .catch((err) => {
        utils.notification(err.response.data.message, 'error')
      })
  }

  return (
    <div className="grid w-full grid-cols-1 gap-y-10">
      <div className="flex flex-col px-4 gap-y-4 ">
        <p className="text-xl dark:text-text-primary">My Info</p>
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-y-4 h-full">
            <Common.Input
              placeholder="Username"
              label="Username"
              type="text"
              disabled
              value={username}
            />
            <Common.Input
              placeholder="Email"
              label="Email"
              type="email"
              disabled
              value={email}
            />
          </div>
          <form
            onSubmit={handleSubmit(Submit as SubmitHandler<FieldValues>)}
            className="flex flex-col gap-y-4 h-full"
          >
            <Controller
              name="oldPassword"
              control={control}
              render={({ field: { onChange } }) => (
                <div className="w-full flex flex-col gap-y-2">
                  <Common.Input
                    onChange={onChange}
                    placeholder="Old Password"
                    label="Old Password"
                    name="oldPassword"
                    type="password"
                  />
                  {errors.oldPassword && (
                    <p className="text-sm text-red-500">
                      {errors.oldPassword.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field: { onChange } }) => (
                <div className="w-full flex flex-col gap-y-2">
                  <Common.Input
                    onChange={onChange}
                    placeholder="New Password"
                    label="New Password"
                    name="newPassword"
                    type="password"
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
              name="passwordConfirmation"
              control={control}
              render={({ field: { onChange } }) => (
                <div className="w-full flex flex-col gap-y-2">
                  <Common.Input
                    onChange={onChange}
                    placeholder="Password Confirmation"
                    label="Password Confirmation"
                    name="passwordConfirmation"
                    type="password"
                  />
                  {errors.passwordConfirmation && (
                    <p className="text-sm text-red-500">
                      {errors.passwordConfirmation.message}
                    </p>
                  )}
                </div>
              )}
            />
            <span className="flex self-end mt-auto px-3 lg:col-start-2">
              <Common.Buttons.Ycodify
                icon={
                  loading ? (
                    <Common.Spinner className="w-4 h-4" />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4" />
                  )
                }
                className="w-max"
                type="submit"
              >
                Change Password
              </Common.Buttons.Ycodify>
            </span>
          </form>
        </div>
      </div>
    </div>
  )
}

const passwordSchema = yup.object().shape({
  oldPassword: yup
    .string()
    .required('This is a required field')
    .test('equal', 'This field cannot contain spaces', (val) => {
      const validation = new RegExp(/\s/g)
      return !validation.test(val as string)
    }),
  password: yup
    .string()
    .required('This is a required field')
    .min(6, 'Password must be at least 6 characters long')
    .test('equal', 'This field cannot contain spaces', (val) => {
      const validation = new RegExp(/\s/g)
      return !validation.test(val as string)
    }),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .test('equal', 'This field cannot contain spaces', (val) => {
      const validation = new RegExp(/\s/g)
      return !validation.test(val as string)
    })
})
