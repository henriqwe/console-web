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
import * as yup from 'yup'
import * as services from 'services'
import * as dashboard from 'domains/dashboard'
import { yupResolver } from '@hookform/resolvers/yup'
import { useUser } from 'contexts/UserContext'
import { format } from 'date-fns'

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
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [schemas, setSchemas] = useState<Schema[]>([])
  const { setOpenSlide, setReload, reload } = dashboard.useData()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        Project: yup
          .object()
          .test('empty', 'This field is required', (val) => !!val.value)
          .required('This field is required'),
        Priority: yup
          .object()
          .test('empty', 'This field is required', (val) => !!val.value)
          .required('This field is required'),
        Category: yup
          .object()
          .test('empty', 'This field is required', (val) => !!val.value)
          .required('This field is required'),
        Title: yup.string().required('This field is required'),
        Content: yup.string().required('This field is required')
      })
    )
  })

  async function Submit(formData: FormData) {
    try {
      await services.ycodify.createTicket({
        project: formData.Project.value,
        userid: user?.userData.id,
        title: formData.Title,
        content: formData.Content,
        category: formData.Category.value,
        status: 'Active',
        date: format(new Date(), 'yyyy-MM-dd HH:mm:ss.ms')
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
    const { data } = await services.ycodify.getSchemas({
      accessToken: utils.getCookie('access_token') as string
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
          defaultValue={{}}
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
          defaultValue={{}}
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
          defaultValue={{}}
          render={({ field: { onChange, value } }) => (
            <div className="col-span-2">
              <common.Select
                placeholder="Select a support Category..."
                label="Category"
                options={[
                  { name: 'Financial', value: 'Financial' },
                  { name: 'Technical', value: 'Thecnical' }
                ]}
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
          defaultValue={''}
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
          defaultValue={''}
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
