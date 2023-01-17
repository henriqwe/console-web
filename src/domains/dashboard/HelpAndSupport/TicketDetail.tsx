import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form'
import { CheckIcon } from '@heroicons/react/outline'
import * as common from 'common'
import * as utils from 'utils'
import * as services from 'services'
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
  name: string
  createdbyuser: boolean
}

type TicketDetail = {
  user?: {
    email: string
    id: number
    username: string
  }
}

export function TicketDetail({ user }: TicketDetail) {
  const [loading, setLoading] = useState(false)
  const [reloadMessages, setReloadMessages] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const { selectedTicket } = dashboard.useData()

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

      await services.ycodify.createTicketMessage({
        content: formData.Content,
        createdbyuser: user?.email !== process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
        date: format(new Date(), 'yyyy-MM-dd HH:mm:ss.ms'),
        ticket: selectedTicket?.id as number,
        ticketid: selectedTicket?.id as number
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
      const { data } = await services.ycodify.getTicketMessages({
        ticketid: selectedTicket?.id as number
      })

      setMessages(
        data?.[0]?.message?.map((ticket) => ({
          ...ticket,
          name: ticket?.createdbyuser ? user?.username : 'Ycodify'
        })) ?? []
      )
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
            </div>
          </div>
          <p className="text-lg font-bold">{selectedTicket?.title}</p>
          <p className="text-sm">{selectedTicket?.content}</p>
          <common.Separator />
          <div className="ml-4">
            <common.Feed activity={messages} />
          </div>
        </common.Card>
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
              id="textAreaNewMessage"
              value={value}
              onChange={onChange}
              errors={errors.Content}
              rows={5}
              cols={5}
            />
          </div>
        )}
      />

      <div className="flex items-center justify-end w-full mt-2">
        <common.Buttons.Ycodify
          loading={loading}
          disabled={loading}
          type="submit"
          icon={<CheckIcon className="w-3 h-3" />}
        >
          Send
        </common.Buttons.Ycodify>
      </div>
    </form>
  )
}
