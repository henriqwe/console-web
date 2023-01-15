import CodeMirror from '@uiw/react-codemirror'
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form'
import { useState } from 'react'
import { CheckIcon, UploadIcon } from '@heroicons/react/outline'
import { InformationCircleIcon } from '@heroicons/react/solid'
import * as common from 'common'
import * as utils from 'utils'
import * as yup from 'yup'
import * as ThemeContext from 'contexts/ThemeContext'
import * as dashboard from 'domains/dashboard'
import { dracula } from '@uiw/codemirror-theme-dracula'
import { EditorView } from '@codemirror/view'
import { yupResolver } from '@hookform/resolvers/yup'

const tooltips = [
  'Must not contain spaces',
  'Must not contain numbers',
  'Must be at least 2 characters long'
]

export function Create() {
  const [loading, setLoading] = useState(false)
  const [submittedSchema, setSubmittedSchema] = useState<string>()
  const {
    setReload,
    reload,
    setCreatedSchemaName,
    setAdminUser,
    setSlideSize,
    setSlideType
  } = dashboard.useData()
  const { isDark } = ThemeContext.useTheme()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm(
    submittedSchema
      ? {
          resolver: yupResolver(
            yup.object().shape({
              ProjectName: yup
                .string()
                .min(3, 'Project name must be at least 3 characters')
                .matches(/^[A-Za-z ]*$/, 'Project name must be only letters')
                .required('Project name is a required field')
                .test(
                  'space',
                  'Project name should not contain spaces',
                  (value) => !value?.includes(' ')
                )
            })
          )
        }
      : undefined
  )

  async function Submit(data: { ProjectName: string }) {
    let projectName = ''
    try {
      setLoading(true)

      const schemas = await utils.api
        .get(utils.apiRoutes.schemas, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        })
        .then((res) =>
          res ? res.data.map((schema: { name: string }) => schema.name) : []
        )

      if (submittedSchema) {
        let schemaParsed: {
          code: string
          schema: {}
          src: any
          types: {}
        }

        schemaParsed = utils.ycl_transpiler.parse(submittedSchema, false)

        projectName = schemaParsed.schema.name
        if (projectName.length < 3) {
          throw new Error('Project name must be at least 3 characters long')
        }

        utils.ycl_transpiler.deploy(schemaParsed.schema, async () => {
          if (schemas.includes(projectName)) {
            utils.notification(`Schema ${projectName} already exists`, 'error')

            return
          }

          //create project
          await utils.api.post(
            utils.apiRoutes.schemas,
            {
              name: projectName
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${utils.getCookie('access_token')}`
              }
            }
          )

          const { data: schemaData } = await utils.api.get(
            `${utils.apiRoutes.schemas}/${projectName}`,
            {
              headers: {
                Authorization: `Bearer ${utils.getCookie('access_token')}`
              }
            }
          )

          for (const entity of schemaParsed.schema.entities) {
            await utils.api.post(
              utils.apiRoutes.entity(projectName as string),
              {
                name: entity.name,
                attributes: entity.attributes.map((attribute) => {
                  return {
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

          const AdminAccount = await utils.api.post(
            utils.apiRoutes.createAdminAccount(projectName),
            {},
            {
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${utils.getCookie('access_token')}`
              }
            }
          )

          setAdminUser(AdminAccount?.data)
          setCreatedSchemaName(projectName)

          utils.setCookie('X-TenantID', schemaData.tenantId)
          utils.setCookie('X-TenantAC', schemaData.tenantAc)
          setReload(!reload)
          utils.notification(
            `Project ${projectName} created successfully`,
            'success'
          )
          setSlideType('ViewAdminUser')
          setSlideSize('normal')
        })
        return
      }

      projectName = data.ProjectName.toLowerCase()

      if (schemas.includes(projectName)) {
        throw new Error(`Project ${projectName} already exists`)
      }

      await utils.api.post(
        utils.apiRoutes.schemas,
        {
          name: projectName
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        }
      )

      const { data: schemaData } = await utils.api.get(
        `${utils.apiRoutes.schemas}/${projectName}`,
        {
          headers: {
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        }
      )

      const AdminAccount = await utils.api.post(
        utils.apiRoutes.createAdminAccount(projectName),
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        }
      )

      setAdminUser(AdminAccount?.data)
      setCreatedSchemaName(projectName)

      utils.setCookie('X-TenantID', schemaData.tenantId)
      utils.setCookie('X-TenantAC', schemaData.tenantAc)
      setReload(!reload)
      utils.notification(
        `Project ${projectName} created successfully`,
        'success'
      )
      setSlideType('ViewAdminUser')
      setSlideSize('normal')
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
      {!submittedSchema && (
        <div className="flex flex-col w-full gap-4 mb-2">
          <Controller
            name={'ProjectName'}
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <div className="col-span-3">
                <common.Input
                  placeholder="Name"
                  label={
                    <div className="flex items-center gap-2">
                      <span>Project Name</span>
                      <div className="relative flex group">
                        <InformationCircleIcon className="w-4 h-4 text-slate-600 dark:text-gray-400" />
                        <ul className="absolute hidden p-2 text-sm font-normal bg-white rounded-lg shadow-lg left-6 -top-1 w-max group-hover:block dark:bg-opacity-95 dark:bg-slate-900">
                          {tooltips.map((tooltip, i) => (
                            <li
                              key={i}
                              className="flex gap-1 before:my-auto before:h-1 before:w-1 before:block before:bg-slate-600 before:dark:bg-white before:rounded-full"
                            >
                              {tooltip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  }
                  value={value}
                  onChange={onChange}
                  errors={errors.ProjectName}
                />
              </div>
            )}
          />
          <div className="flex justify-center w-full">
            <div className="w-56 ">
              <common.illustrations.Colorschemes />
            </div>
          </div>
        </div>
      )}
      {submittedSchema && (
        <div className="w-full my-2">
          <CodeMirror
            value={submittedSchema}
            className="flex w-full h-[25rem] max-h-[25rem] min-h-[25rem] 2lx:h-[45rem] 2xl:max-h-[45rem] 2xl:min-h-[45rem] "
            width="100%"
            data-testid="editor"
            onChange={(value) => {
              setSubmittedSchema(value)
            }}
            theme={isDark ? dracula : 'light'}
            extensions={[EditorView.lineWrapping]}
          />
        </div>
      )}

      <common.Separator className="mb-7" />
      <div className="flex justify-between w-full">
        <div>
          <div
            className={`flex ${
              submittedSchema ? 'justify-between' : 'justify-end'
            }  w-full gap-4`}
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
                Import schema <UploadIcon className="w-5 h-5" />
              </label>
              <input
                type="file"
                id="file"
                accept=".yc"
                className="hidden"
                data-testid="schemafile"
                onChange={(e) => {
                  try {
                    const file = e.target.files![0]
                    if (!file.name.includes('.yc')) {
                      throw new Error('Unsupported file type')
                    }

                    const reader = new FileReader()
                    reader.addEventListener('load', (event) => {
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
        </div>
        <common.Buttons.WhiteOutline
          disabled={loading}
          loading={loading}
          icon={<CheckIcon className="w-4 h-4" />}
          type="submit"
        >
          Create project
        </common.Buttons.WhiteOutline>
      </div>
    </form>
  )
}
