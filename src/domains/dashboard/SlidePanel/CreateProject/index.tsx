import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form'
import { Dispatch, SetStateAction, useState } from 'react'
import { CheckCircleIcon, CheckIcon } from '@heroicons/react/outline'
import * as common from 'common'
import * as utils from 'utils'
import * as dashboard from 'domains/dashboard'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { routes } from 'domains/routes'

const plans = {
  'Caixa de areia': {
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem perferendis possimus ipsam harum alias quidem recusandae iusto quis cupiditate maiores fugiat, optio',
    features: [
      'Ambiente de testes',
      'Modelo de dados ilimitado',
      'Elasticidade ilimitada',
      'Tráfego limitado a 500 MB/dia',
      'Armazenamento limitado a 1 GB',
      'Sem custos adicionais'
    ]
  },
  Padrao: {
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem perferendis possimus ipsam harum alias quidem recusandae iusto quis cupiditate maiores fugiat, optio',
    features: [
      'Ambiente de produção',
      'Modelo de dados ilimitado',
      'Elasticidade ilimitada',
      'Tráfego de dados ilimitado',
      'Armazenamento limitado a 10 GB',
      'Sem custos adicionais'
    ]
  },
  'Plano sem nome': {
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem perferendis possimus ipsam harum alias quidem recusandae iusto quis cupiditate maiores fugiat, optio',
    features: [
      'Placeholder',
      'Placeholder',
      'Placeholder',
      'Placeholder',
      'Placeholder',
      'Placeholder'
    ]
  },
  Enterprise: {
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem perferendis possimus ipsam harum alias quidem recusandae iusto quis cupiditate maiores fugiat, optio',
    features: [
      'Ambiente de produção',
      'Modelo de dados ilimitado',
      'Elasticidade ilimitada',
      'Tráfego de dados ilimitado',
      'Armazenamento ilimitado',
      'Custos sob medida'
    ]
  }
}

export function Create() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<
    'Caixa de Areia' | 'Padrão' | 'Plano sem nome' | 'Enterprise'
  >()
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

      const { data: schemaData } = await utils.api.get(
        `${utils.apiRoutes.schemas}/${data.ProjectName}`,
        {
          headers: {
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        }
      )

      utils.setCookie('X-TenantID', schemaData.tenantId)
      utils.setCookie('X-TenantAC', schemaData.tenantAc)
      setReload(!reload)
      utils.notification(
        `Project ${data.ProjectName} created successfully`,
        'success'
      )
      router.push(routes.console + '/' + data.ProjectName)
    } catch (err: any) {
      utils.showError(err)
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
            value: 'Caixa de Areia',
            content: (
              <div>
                <div className="flex flex-col gap-y-1">
                  <p className="font-bold dark:text-gray-200">Caixa de Areia</p>
                  {plan === 'Caixa de Areia' && (
                    <div className="absolute top-0 right-0 p-2 bg-green-400 border-b border-l border-green-500 rounded-tr-lg rounded-bl-lg dark:bg-green-600">
                      <p className="flex items-center gap-1 text-white ">
                        Selected{' '}
                        <span className="w-5 h-5">
                          <CheckCircleIcon />
                        </span>
                      </p>
                    </div>
                  )}
                  <p className="text-sm">
                    {plans['Caixa de areia'].description}
                  </p>
                  <common.Separator />

                  <div>
                    <p className="font-bold">Features</p>
                    <ul>
                      {plans['Caixa de areia'].features.map((feature) => (
                        <li className="flex items-center gap-1" key={feature}>
                          <div className="w-5 h-5 text-blue-500">
                            <CheckCircleIcon />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          },
          {
            value: 'Padrão',
            content: (
              <div>
                <div className="flex flex-col gap-y-1">
                  <p className="font-bold dark:text-gray-200">Padrão</p>
                  {plan === 'Padrão' && (
                    <div className="absolute top-0 right-0 p-2 bg-green-400 border-b border-l border-green-500 rounded-tr-lg rounded-bl-lg dark:bg-green-600">
                      <p className="flex items-center gap-1 text-white ">
                        Selected{' '}
                        <span className="w-5 h-5">
                          <CheckCircleIcon />
                        </span>
                      </p>
                    </div>
                  )}
                  <p className="text-sm">{plans['Padrao'].description}</p>
                  <common.Separator />

                  <div>
                    <p className="font-bold">Features</p>
                    <ul>
                      {plans['Padrao'].features.map((feature) => (
                        <li className="flex items-center gap-1" key={feature}>
                          <div className="w-5 h-5 text-blue-500">
                            <CheckCircleIcon />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          },
          {
            value: 'Plano sem nome',
            content: (
              <div>
                <div className="flex flex-col gap-y-1">
                  <p className="font-bold dark:text-gray-200">Plano sem nome</p>
                  {plan === 'Plano sem nome' && (
                    <div className="absolute top-0 right-0 p-2 bg-green-400 border-b border-l border-green-500 rounded-tr-lg rounded-bl-lg dark:bg-green-600">
                      <p className="flex items-center gap-1 text-white ">
                        Selected{' '}
                        <span className="w-5 h-5">
                          <CheckCircleIcon />
                        </span>
                      </p>
                    </div>
                  )}
                  <p className="text-sm">
                    {plans['Plano sem nome'].description}
                  </p>
                  <common.Separator />

                  <div>
                    <p className="font-bold">Features</p>
                    <ul>
                      {plans['Plano sem nome'].features.map((feature) => (
                        <li className="flex items-center gap-1" key={feature}>
                          <div className="w-5 h-5 text-blue-500">
                            <CheckCircleIcon />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          },
          {
            value: 'Enterprise',
            content: (
              <div>
                <div className="flex flex-col gap-y-1">
                  <p className="font-bold dark:text-gray-200">Enterprise</p>
                  {plan === 'Enterprise' && (
                    <div className="absolute top-0 right-0 p-2 bg-green-400 border-b border-l border-green-500 rounded-tr-lg rounded-bl-lg dark:bg-green-600">
                      <p className="flex items-center gap-1 text-white ">
                        Selected{' '}
                        <span className="w-5 h-5">
                          <CheckCircleIcon />
                        </span>
                      </p>
                    </div>
                  )}
                  <p className="text-sm">{plans['Enterprise'].description}</p>
                  <common.Separator />

                  <div>
                    <p className="font-bold">Features</p>
                    <ul>
                      {plans['Enterprise'].features.map((feature) => (
                        <li className="flex items-center gap-1" key={feature}>
                          <div className="w-5 h-5 text-blue-500">
                            <CheckCircleIcon />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
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

      <common.Separator className="mb-7" />

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
