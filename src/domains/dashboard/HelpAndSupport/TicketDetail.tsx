import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form'
import { CheckIcon, ReplyIcon } from '@heroicons/react/outline'
import * as common from 'common'
import * as utils from 'utils'
import * as dashboard from 'domains/dashboard'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'

type FormData = {
  Content: string
}

type Message = {
  content: string
  id: string
  date: string
}

export function TicketDetail() {
  const [loading, setLoading] = useState(false)
  const [reloadMessages, setReloadMessages] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const { selectedTicket, setSelectedTicket } = dashboard.useData()

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm()

  async function createTicketMessage(formData: FormData) {
    try {
      setLoading(true)
      if (!formData.Content || formData.Content === '') {
        throw new Error('Cannot create a empty message')
      }
      let currentDate = new Date()
      const offset = currentDate.getTimezoneOffset()
      currentDate = new Date(currentDate.getTime() - offset * 60 * 1000)

      await fetch('https://api.ycodify.com/v0/persistence/s/no-ac', {
        method: 'POST',
        body: JSON.stringify({
          action: 'CREATE',
          data: [
            {
              ticketsmessages: {
                date: format(new Date(), 'yyyy-MM-dd HH:mm:ss.ms'),
                createdbyuser: true,
                content: formData.Content,
                ticket: selectedTicket?.id
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
      setReloadMessages(!reloadMessages)
      setValue('Content', '')
    } catch (err) {
      utils.showError(err)
    } finally {
      setLoading(false)
    }
  }

  async function loadMessages() {
    try {
      const result = await fetch(
        'https://api.ycodify.com/v0/persistence/s/no-ac',
        {
          method: 'POST',
          body: JSON.stringify({
            action: 'READ',
            data: [
              {
                ticketsmessages: {
                  ticket: {
                    tickets: {
                      id: selectedTicket?.id
                    }
                  }
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
        }
      )

      const data = await result.json()
      setMessages(data?.[0]?.ticketsmessages ?? [])
    } catch (err) {
      utils.showError(err)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [reloadMessages])

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={handleSubmit(createTicketMessage as SubmitHandler<FieldValues>)}
    >
      <div className="flex flex-col gap-6">
        <common.Card className="flex flex-col gap-4 p-4 bg-white dark:bg-menu-primary">
          <div>
            <div className="z-20 flex items-center gap-2">
              <p className="text-xs leading-none dark:text-gray-400">
                Ticket {selectedTicket?.id}
              </p>
              <div
                className="flex items-center gap-1 px-1 text-gray-300 bg-gray-600 rounded-sm cursor-pointer text-super-tiny hover:bg-gray-600 hover:text-gray-200"
                onClick={() => {
                  setSelectedTicket(undefined)
                }}
              >
                <ReplyIcon className="w-2 h-2" />
                <span>Back</span>
              </div>
            </div>
          </div>

          <p className="text-lg font-bold">{selectedTicket?.title}</p>

          <p className="text-sm">{selectedTicket?.content}</p>
        </common.Card>
        <div className="ml-4">
          <common.Feed activity={messages} />
        </div>
      </div>

      <common.Separator className="border-gray-400" />
      <Controller
        name={'Content'}
        control={control}
        render={({ field: { onChange, value } }) => (
          <div className="col-span-3">
            <common.Textarea
              placeholder="Enter a new message here..."
              label="New message"
              value={value}
              onChange={onChange}
              errors={errors.Content}
              rows={5}
              cols={5}
            />
          </div>
        )}
      />

      <div className="flex items-center justify-between w-full mt-2">
        <common.Buttons.WhiteOutline
          onClick={() => setSelectedTicket(undefined)}
          loading={loading}
          disabled={loading}
          type="button"
          icon={<ReplyIcon className="w-3 h-3" />}
        >
          Back to list
        </common.Buttons.WhiteOutline>

        <common.Buttons.GreenOutline
          loading={loading}
          disabled={loading}
          type="submit"
          icon={<CheckIcon className="w-3 h-3" />}
        >
          Create message
        </common.Buttons.GreenOutline>
      </div>
    </form>
  )
}
