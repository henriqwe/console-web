import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form'
import { useState } from 'react'
import axios from 'axios'
import * as consoleSection from 'domains/console'
import * as common from 'common'
import * as utils from 'utils'
import { yupResolver } from '@hookform/resolvers/yup'

export function CreateAccount() {
  const [loading, setLoading] = useState(false)
  const { createUserSchema, reload, setReload, setOpenSlide } =
    consoleSection.useUser()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: yupResolver(createUserSchema) })

  const onSubmit = async (formData: {
    Email: string
    Username: string
    Password: string
  }) => {
    setLoading(true)
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/createAccount`, {
        username: formData.Username,
        password: formData.Password,
        email: formData.Email
      })
      reset()
      setReload(!reload)
      setOpenSlide(false)
      setLoading(false)
      utils.notification('User created successfully', 'success')
    } catch (err: any) {
      utils.notification(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
      data-testid="editForm"
      className="flex flex-col items-end"
    >
      <div className="flex flex-col w-full gap-2 mb-2">
        <Controller
          name={'Username'}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="flex-1">
              <common.Input
                placeholder={'User name'}
                label="User name"
                value={value}
                onChange={onChange}
                errors={errors.Username}
              />
            </div>
          )}
        />

        <Controller
          name={'Email'}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="flex-1">
              <common.Input
                placeholder={'E-mail'}
                label="E-mail"
                value={value}
                onChange={onChange}
                errors={errors.Email}
              />
            </div>
          )}
        />

        <Controller
          name={'Password'}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="flex-1">
              <common.Input
                placeholder={'Password'}
                label="Password"
                value={value}
                onChange={onChange}
                errors={errors.Password}
                type="password"
              />
            </div>
          )}
        />
      </div>
      <div className="my-2">
        <common.Separator />
      </div>
      <common.Buttons.Blue disabled={loading} loading={loading}>
        <div className="flex">Create</div>
      </common.Buttons.Blue>
    </form>
  )
}
