import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form'
import { useState } from 'react'
import { CheckIcon } from '@heroicons/react/outline'
import * as common from 'common'
import * as utils from 'utils'
import * as dashboard from 'domains/dashboard'
import { yupResolver } from '@hookform/resolvers/yup'

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

export function CreateTicket() {
  const [loading, setLoading] = useState(false)
  const { schemas, createTicketSchema, setTickets, tickets, setOpenSlide } =
    dashboard.useData()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: yupResolver(createTicketSchema) })

  async function Submit(data: FormData) {
    try {
      setLoading(true)

      setTickets([
        ...tickets,
        {
          category: 'Associations',
          message:
            "Hi, I'm trying to create an association between two entities but I received an error saying that I need to stop the schema to create a new association, what's really wrong?",
          project: 'Blog',
          status: 'Open',
          ticketId: (tickets.length + 1).toString(),
          title: "Can't create associations"
        }
      ])
      setOpenSlide(false)
      utils.notification(`Ticket created successfully`, 'success')
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
