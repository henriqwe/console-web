import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form'
import { Dispatch, SetStateAction, useState } from 'react'
import {
  CheckCircleIcon,
  CheckIcon
} from '@heroicons/react/outline'
import * as common from 'common'
import * as utils from 'utils'
import * as dashboard from 'domains/dashboard'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { routes } from 'domains/routes'

export function Create() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<'Sandbox' | 'Dedicated'>()
  const { createProjectSchema, setReload, reload } = dashboard.useData()

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

      const response = await utils.api
        .get(utils.apiRoutes.schemas, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        })
        .catch(() => null)

      const schemas = response
        ? response.data.map((schema: { name: string }) => schema.name)
        : []

      if (schemas.includes(data.ProjectName.toLowerCase())) {
        throw new Error(`Project ${data.ProjectName} already exists`)
      }

      await utils.api.post(
        utils.apiRoutes.schemas,
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

      setReload(!reload)
      utils.notification(
        `Project ${data.ProjectName} created successfully`,
        'success'
      )
      router.push(routes.console + '/' + data.ProjectName)
    } catch (err: any) {
      utils.notification(err.message, 'error')
    } finally {
      setLoading(false)
    }
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
      <p className="w-full text-sm font-medium dark:text-gray-200">
        Select a plan
      </p>
      <common.ListRadioGroup
        options={[
          {
            value: 'Sandbox',
            content: (
              <div>
                <div>
                  <p className="font-bold dark:text-gray-200">Sandbox</p>
                  {plan === 'Sandbox' && (
                    <div className="absolute top-0 right-0 p-2 bg-green-400 border-b border-l border-green-500 rounded-tr-lg rounded-bl-lg dark:bg-green-600">
                      <p className="flex items-center gap-1 text-white ">
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
                  <p className="font-bold dark:text-gray-200">Dedicated</p>
                  {plan === 'Dedicated' && (
                    <div className="absolute top-0 right-0 p-2 bg-green-400 border-b border-l border-green-500 rounded-tr-lg rounded-bl-lg dark:bg-green-600">
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

      <common.Separator />

      <common.Buttons.Clean
        disabled={loading}
        loading={loading}
        icon={<CheckIcon className="w-4 h-4" />}
      >
        Create project
      </common.Buttons.Clean>
    </form>
  )
}
