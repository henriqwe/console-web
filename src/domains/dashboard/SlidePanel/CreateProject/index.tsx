import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form'
import { Dispatch, SetStateAction, useState } from 'react'
import { CheckCircleIcon } from '@heroicons/react/outline'
import { UserCircleIcon } from '@heroicons/react/solid'
import * as common from 'common'
import * as utils from 'utils'
import * as dashboard from 'domains/dashboard'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { routes } from 'domains/routes'

export function Update() {
  const router = useRouter()
  const [adminUser, setAdminUser] = useState<{
    username: string
    password: string
  }>()
  const [createdSchemaName, setCreatedSchemaName] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<'Sandbox' | 'Dedicated'>()
  const { createProjectSchema } = dashboard.useData()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: yupResolver(createProjectSchema) })

  async function Submit(data: { ProjectName: string }) {
    try {
      setLoading(true)
      if (!plan) {
        throw new Error('Select a plan to create a new project')
      }

      const spaceValidation = new RegExp(/\s/g)
      if (spaceValidation.test(data.ProjectName)) {
        throw new Error('Project name cannot contain spaces')
      }

      const response = await utils.localApi
        .get(`/schemas`, {
          headers: {
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        })
        .catch(() => null)
      const schemas = response ? response.data.data : []

      if (schemas.includes(data.ProjectName.toLowerCase())) {
        throw new Error(`Project ${data.ProjectName} already exists`)
      }

      await utils.api.post(
        '/modeler/schema',
        {
          name: data.ProjectName
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        }
      )

      const AdminAccount = await utils.api.post(
        `/modeler/schema/${data.ProjectName}/create-admin-account`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        }
      )
      setAdminUser(AdminAccount.data)
      setCreatedSchemaName(data.ProjectName)
      utils.notification(
        `Project ${data.ProjectName} created successfully`,
        'success'
      )
    } catch (err: any) {
      utils.notification(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  async function AccessSchema() {
    try {
      setLoading(true)

      const { data } = await utils.localApi.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/adminLogin`,
        {
          username: adminUser?.username,
          password: adminUser?.password
        }
      )
      utils.setCookie('admin_access_token', data.data.access_token)
      utils.setCookie('X-TenantID', data.data.username)

      utils.notification(`Project concluded successfully`, 'success')
      router.push(routes.console + '/' + createdSchemaName)
    } catch (err: any) {
      console.log(err)
      utils.notification(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  if (adminUser) {
    return (
      <div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center w-full gap-5">
            <div className="w-40 h-40">
              <UserCircleIcon />
            </div>
            <p className="text-lg">Schema {createdSchemaName} created!</p>
            <p className="text-sm">
              Save the admin user data to access the schema
            </p>
            <div>
              <p className="text-sm text-gray-600">
                Admin user name:{' '}
                <span className="font-bold">{adminUser?.username}</span>
              </p>
              <p className="text-sm text-gray-600">
                Admin password:{' '}
                <span className="font-bold">{adminUser?.password}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end w-full">
            <div className="flex gap-4">
              <common.Buttons.Blue
                loading={loading}
                disabled={loading}
                onClick={AccessSchema}
              >
                Access schema
              </common.Buttons.Blue>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(Submit as SubmitHandler<FieldValues>)}
      data-testid="editForm"
      className="flex flex-col items-end"
    >
      <div className="flex flex-col w-full gap-2 mb-2">
        <Controller
          name={'ProjectName'}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="col-span-3">
              <common.Input
                placeholder="Project name"
                label="Project name"
                value={value}
                onChange={onChange}
                errors={errors.ProjectName}
              />
            </div>
          )}
        />
      </div>
      <p className="w-full">Select a plan</p>
      <common.ListRadioGroup
        options={[
          {
            value: 'Sandbox',
            content: (
              <div>
                <div>
                  <p className="font-bold">Sandbox</p>
                  {plan === 'Sandbox' && (
                    <div className="absolute top-0 right-0 p-2 bg-green-400 border-b border-l border-green-500 rounded-tr-lg rounded-bl-lg">
                      <p className="flex items-center gap-1 text-white">
                        Selected{' '}
                        <span className="w-5 h-5">
                          <CheckCircleIcon />
                        </span>
                      </p>
                    </div>
                  )}
                  <div className="my-2">
                    <common.Separator className="border-gray-400" />
                  </div>
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Dolorem perferendis possimus ipsam harum alias quidem
                    recusandae iusto quis cupiditate maiores fugiat, optio
                  </p>
                  <div className="my-2">
                    <common.Separator className="border-gray-400" />
                  </div>
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Dolorem perferendis possimus ipsam harum alias
                  </p>
                  <div className="my-2">
                    <common.Separator className="border-gray-400" />
                  </div>

                  <div>
                    <p className="font-bold">Features</p>
                    <ul>
                      {[1, 2, 3].map((item) => (
                        <li className="flex items-center gap-1" key={item}>
                          <div className="w-5 h-5 text-blue-500">
                            <CheckCircleIcon />
                          </div>
                          abc
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          },
          {
            value: 'Dedicated',
            content: (
              <div>
                <div>
                  <p className="font-bold">Dedicated</p>
                  {plan === 'Dedicated' && (
                    <div className="absolute top-0 right-0 p-2 bg-green-400 border-b border-l border-green-500 rounded-tr-lg rounded-bl-lg">
                      <p className="flex items-center gap-1 text-white">
                        Selected{' '}
                        <span className="w-5 h-5">
                          <CheckCircleIcon />
                        </span>
                      </p>
                    </div>
                  )}

                  <div className="my-2">
                    <common.Separator className="border-gray-400" />
                  </div>
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Dolorem perferendis possimus ipsam harum alias quidem
                    recusandae iusto quis cupiditate maiores fugiat, optio
                  </p>
                  <div className="my-2">
                    <common.Separator className="border-gray-400" />
                  </div>
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Dolorem perferendis possimus ipsam harum alias
                  </p>
                  <div className="my-2">
                    <common.Separator className="border-gray-400" />
                  </div>

                  <div>
                    <p className="font-bold">Features</p>
                    <div className="grid justify-between w-full grid-cols-2">
                      <ul>
                        {[1, 2, 3].map((item) => (
                          <li className="flex items-center gap-1" key={item}>
                            <div className="w-5 h-5 text-blue-500">
                              <CheckCircleIcon />
                            </div>
                            abc
                          </li>
                        ))}
                      </ul>
                      <ul>
                        {[1, 2, 3].map((item) => (
                          <li className="flex items-center gap-1" key={item}>
                            <div className="w-5 h-5 text-blue-500">
                              <CheckCircleIcon />
                            </div>
                            abc
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        ]}
        showCheckIcon={false}
        horizontal
        setSelectedOption={setPlan as Dispatch<SetStateAction<string>>}
      />

      <div className="my-2">
        <common.Separator />
      </div>
      <common.Buttons.Blue disabled={loading} loading={loading}>
        Create project
      </common.Buttons.Blue>
    </form>
  )
}
