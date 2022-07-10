import * as common from 'common'
import * as utils from 'utils'
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form'
import * as createProject from 'domains/createProject'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { routes } from 'domains/routes'

type FormData = {
  UserName: string
  Email: string
  Password: string
}

export function CreateAdminUser() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { createUserSchema, createdSchemaName } =
    createProject.useCreateProject()
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: yupResolver(createUserSchema) })

  function Submit(data: FormData) {
    try {
      setLoading(true)

      router.push(routes.console + '/' + createdSchemaName)
    } catch (err: any) {
      utils.notification(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <common.Card className="p-6 bg-white">
      <form onSubmit={handleSubmit(Submit as SubmitHandler<FieldValues>)} className="flex flex-col gap-4">
        <Controller
          name={'UserName'}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="col-span-3">
              <common.Input
                placeholder="User name"
                label="User name"
                value={value}
                onChange={onChange}
                errors={errors.UserName}
              />
            </div>
          )}
        />

        <Controller
          name={'Email'}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="col-span-3">
              <common.Input
                placeholder="Email"
                label="Email"
                type="email"
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
            <div className="col-span-3">
              <common.Input
                placeholder="Password"
                label="Passsword"
                value={value}
                type="password"
                onChange={onChange}
                errors={errors.Password}
              />
            </div>
          )}
        />

        <div className="flex justify-end w-full">
          <common.Button loading={loading} disabled={loading}>
            Create admin user
          </common.Button>
        </div>
      </form>
    </common.Card>
  )
}
