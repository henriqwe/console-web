import CodeMirror from '@uiw/react-codemirror'
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
import * as ThemeContext from 'contexts/ThemeContext'
import * as dashboard from 'domains/dashboard'
import { dracula } from '@uiw/codemirror-theme-dracula'
import { EditorView } from '@codemirror/view'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { routes } from 'domains/routes'

const plans = {
  Free: {
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
  Pro: {
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
  }
}

export function Create() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<
    'Free' | 'Pro' | 'Plano sem nome' | 'Enterprise'
  >()
  const [submittedSchema, setSubmittedSchema] = useState<string>()
  const { createProjectSchema, setReload, reload } = dashboard.useData()
  const { isDark } = ThemeContext.useTheme()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: yupResolver(createProjectSchema(submittedSchema)) })

  async function Submit(data: { ProjectName: string }) {
    try {
      setLoading(true)
      if (!plan) {
        throw new Error('Select a plan to create a new project')
      }

      const spaceValidation = new RegExp(/\s/g)

      if (submittedSchema) {
        const schemaParsed = utils.ycl_transpiler.parse(submittedSchema)
        utils.ycl_transpiler.deploy(schemaParsed.schema, async () => {
          setReload(!reload)
          const { data: schemaData } = await utils.api.get(
            `${utils.apiRoutes.schemas}/${schemaParsed.schema.name}`,
            {
              headers: {
                Authorization: `Bearer ${utils.getCookie('access_token')}`
              }
            }
          )

          for (const entity of schemaParsed.schema.entities) {
            await utils.api.post(
              utils.apiRoutes.entity(schemaParsed.schema.name as string),
              {
                name: entity.name,
                attributes: entity.attributes.map(attribute => {
                  console.log('attribute',attribute)
                  return{
                    ...attribute,
                    type: attribute._conf.type.value
                  }
                }),
                associations: entity.associations ?? []
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${utils.getCookie('access_token')}`
                }
              }
            )
          }

          utils.setCookie('X-TenantID', schemaData.tenantId)
          utils.setCookie('X-TenantAC', schemaData.tenantAc)
          utils.notification(
            `Project ${schemaParsed.schema.name} created successfully`,
            'success'
          )

          router.push(routes.console + '/' + schemaParsed.schema.name)
        })

        return
      }
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
      <div
        className={`flex ${
          submittedSchema ? 'justify-between' : 'justify-end'
        }  w-full gap-2 mb-2`}
      >
        {submittedSchema && (
          <common.Buttons.RedOutline
            disabled={loading}
            loading={loading}
            onClick={() => {
              setSubmittedSchema(undefined)
            }}
          >
            <p>Cancel</p>
          </common.Buttons.RedOutline>
        )}
        <div>
          <label
            htmlFor="file"
            className={`border px-2 py-2 text-xs transition disabled:cursor-not-allowed hover:cursor-pointer rounded-md flex gap-2 items-center justify-center`}
          >
            Import schema
          </label>
          <input
            type="file"
            id="file"
            accept=".txt"
            className="hidden"
            onChange={(e) => {
              try {
                const file = e.target.files![0]
                if (file.type !== 'text/plain') {
                  throw new Error('Tipo de arquivo não aceito')
                }

                const reader = new FileReader()
                reader.addEventListener('load', (event) => {
                  console.log('event', event)
                  setSubmittedSchema(event?.target?.result as string)
                })
                reader.readAsText(file)
              } catch (err) {
                utils.showError(err)
              }
            }}
          />
        </div>
      </div>

      {!submittedSchema && (
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
      )}
      {submittedSchema && (
        <div className="w-full my-2">
          <CodeMirror
            value={submittedSchema}
            className="flex w-full h-[31rem] max-h-[31rem] min-h-[31rem] 2lx:h-[49rem] 2xl:max-h-[49rem] 2xl:min-h-[49rem] "
            width="100%"
            onChange={(value) => {
              setSubmittedSchema(value)
            }}
            theme={isDark ? dracula : 'light'}
            extensions={[EditorView.lineWrapping]}
          />
        </div>
      )}
      <common.Separator />
      <p className="w-full text-sm font-medium dark:text-gray-200">
        Select a plan
      </p>
      <common.ListRadioGroup
        options={[
          {
            value: 'Free',
            content: (
              <div>
                <div className="flex flex-col gap-y-1">
                  <p className="font-bold dark:text-gray-200">Free</p>
                  {plan === 'Free' && (
                    <div className="absolute top-0 right-0 p-2 bg-green-400 border-b border-l border-green-500 rounded-tr-lg rounded-bl-lg dark:bg-green-600">
                      <p className="flex items-center gap-1 text-white ">
                        Selected{' '}
                        <span className="w-5 h-5">
                          <CheckCircleIcon />
                        </span>
                      </p>
                    </div>
                  )}
                  <p className="text-sm">{plans['Free'].description}</p>
                  <common.Separator />

                  <div>
                    <p className="font-bold">Features</p>
                    <ul>
                      {plans['Free'].features.map((feature) => (
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
            value: 'Pro',
            content: (
              <div>
                <div className="flex flex-col gap-y-1">
                  <p className="font-bold dark:text-gray-200">Pro</p>
                  {plan === 'Pro' && (
                    <div className="absolute top-0 right-0 p-2 bg-green-400 border-b border-l border-green-500 rounded-tr-lg rounded-bl-lg dark:bg-green-600">
                      <p className="flex items-center gap-1 text-white ">
                        Selected{' '}
                        <span className="w-5 h-5">
                          <CheckCircleIcon />
                        </span>
                      </p>
                    </div>
                  )}
                  <p className="text-sm">{plans['Pro'].description}</p>
                  <common.Separator />

                  <div>
                    <p className="font-bold">Features</p>
                    <ul>
                      {plans['Pro'].features.map((feature) => (
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
