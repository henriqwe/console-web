import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form'
import { useEffect, useState } from 'react'
import { CheckIcon } from '@heroicons/react/outline'
import * as common from 'common'
import * as utils from 'utils'
import * as dashboard from 'domains/dashboard'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'

type FormData = {
  Project: SelectObject
  Priority: SelectObject
  Category: SelectObject
  Title: string
  Content: string
}

type SelectObject = {
  name: string
  value: string
}

type Schema = {
  createdat: number
  name: string
  status: string
  tenantAc: string
  tenantId: string
}

export function CreateTicket() {
  const [loading, setLoading] = useState(false)
  const [schemas, setSchemas] = useState<Schema[]>([])
  const { createTicketSchema, setOpenSlide, setReload, reload } =
    dashboard.useData()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: yupResolver(createTicketSchema) })

  async function Submit(formData: FormData) {
    try {
      const { data } = await axios.get(
        'https://api.ycodify.com/v0/id/account/get',
        {
          headers: {
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        }
      )

      await fetch('https://api.ycodify.com/v0/persistence/s/no-ac', {
        method: 'POST',
        body: JSON.stringify({
          action: 'CREATE',
          data: [
            {
              tickets: {
                project: formData.Project.value,
                userid: data.id,
                title: formData.Title,
                content: formData.Content,
                category: formData.Category.value,
                status: 'Active'
              }
            }
          ]
        }),
        headers: {
          'X-TenantAC': 'b44f7fc8-e2b7-3cc8-9a3d-04b3dac69886',
          'X-TenantID': '9316c346-4db5-35aa-896f-f61fe1a7d9d8',
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      })
      setReload(!reload)
      setOpenSlide(false)
      utils.notification(`Ticket created successfully`, 'success')
    } catch (err: any) {
      utils.showError(err)
    } finally {
      setLoading(false)
    }
  }

  async function loadSchemas() {
    const { data } = await utils.api.get(utils.apiRoutes.schemas, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${utils.getCookie('access_token')}`
      }
    })
    setSchemas(data)
  }

  useEffect(() => {
    loadSchemas()
  }, [])

  return (
    <form
      onSubmit={handleSubmit(Submit as SubmitHandler<FieldValues>)}
      data-testid="editForm"
      className="flex flex-col items-end"
    >
      <div className="flex flex-col w-full gap-2 mb-2">
        <Controller
          name={'Project'}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="col-span-2">
              <common.Select
                placeholder="Select a Project..."
                label="Project"
                options={schemas.map((schema) => {
                  return {
                    name: schema.name,
                    value: schema.name
                  }
                })}
                value={value}
                onChange={onChange}
                errors={errors.Project}
              />
            </div>
          )}
        />

        <Controller
          name={'Priority'}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="col-span-2">
              <common.Select
                placeholder="Select a Priority level..."
                label="Priority"
                options={[
                  { name: 'Low', value: 'Low' },
                  { name: 'Medium', value: 'Medium' },
                  { name: 'High', value: 'High' },
                  { name: 'Urgent', value: 'Urgent' }
                ]}
                value={value}
                onChange={onChange}
                errors={errors.Priority}
              />
            </div>
          )}
        />

        <Controller
          name={'Category'}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="col-span-2">
              <common.Select
                placeholder="Select a Ticket Category..."
                label="Category"
                options={[{ name: 'String', value: 'String' }]}
                value={value}
                onChange={onChange}
                errors={errors.Category}
              />
            </div>
          )}
        />

        <Controller
          name={'Title'}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="col-span-3">
              <common.Input
                placeholder="Enter the ticket title..."
                label="Ticket title"
                value={value}
                onChange={onChange}
                errors={errors.Title}
              />
            </div>
          )}
        />

        <Controller
          name={'Content'}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="col-span-3">
              <common.Textarea
                placeholder="Enter message..."
                label="Ticket Content"
                value={value}
                onChange={onChange}
                errors={errors.Content}
                rows={5}
                cols={5}
              />
            </div>
          )}
        />
      </div>

      <common.Separator className="mb-7" />

      <common.Buttons.WhiteOutline
        disabled={loading}
        loading={loading}
        icon={<CheckIcon className="w-4 h-4" />}
        type="submit"
      >
        Create ticket
      </common.Buttons.WhiteOutline>
    </form>
  )
}
