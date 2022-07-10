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
import { Icon } from '@iconify/react'
import { useState } from 'react'

export function CreateSchema() {
  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState<string>()
  const { setCurrentPage, createProjectSchema, setCreatedSchemaName } =
    createProject.useCreateProject()
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: yupResolver(createProjectSchema) })

  function Submit(data: { ProjectName: string }) {
    try {
      setLoading(true)
      if (!provider) {
        throw new Error('Select a provider to create a new project')
      }

      setCurrentPage('USER')
      setCreatedSchemaName(data.ProjectName)
    } catch (err: any) {
      utils.notification(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <common.Card className="p-6 bg-white">
      <form onSubmit={handleSubmit(Submit as SubmitHandler<FieldValues>)}>
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

        <div className="my-4">
          <p className="text-gray-700">Provider</p>
          <common.ListRadioGroup
            options={[
              {
                value: 'aws',
                content: (
                  <div className="inline-flex items-center gap-4">
                    <Icon icon="logos:aws" className="w-6 h-6" />
                    <div className="text-left">
                      <p className="text-sm">AWS</p>
                      <span className="text-tiny">Amazon Web Service</span>
                    </div>
                  </div>
                )
              },
              {
                value: 'google cloud',
                content: (
                  <div className="inline-flex items-center gap-4">
                    <Icon icon="logos:google-cloud" className="w-6 h-6" />
                    <div className="text-left">
                      <p className="text-sm">Google Cloud</p>
                      <span className="text-tiny">Google Cloud Service</span>
                    </div>
                  </div>
                )
              },
              {
                value: 'azure',
                content: (
                  <div className="inline-flex items-center gap-4">
                    <Icon icon="logos:microsoft-azure" className="w-6 h-6" />
                    <div className="text-left">
                      <p className="text-sm">Azure</p>
                      <span className="text-tiny">Microsoft Azure Service</span>
                    </div>
                  </div>
                )
              }
            ]}
            horizontal
            setSelectedOption={setProvider}
            disabled={loading}
          />
        </div>

        <div className="flex justify-end w-full">
          <common.Button loading={loading} disabled={loading}>
            Create project
          </common.Button>
        </div>
      </form>
    </common.Card>
  )
}
