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
import { useState } from 'react'

type FormData = {
  Content: string
}

type Message = {
  text: string
  date: string
  mine: boolean
}

export function TicketDetail() {
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, distinctio voluptate illo inventore reprehenderit aut repellendus est corrupti veniam molestiae perferendis nam officiis in repudiandae tempore mollitia. Facilis, culpa assumenda.',
      date: new Date().toLocaleString('pt-BR'),
      mine: false
    },
    {
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, distinctio voluptate illo inventore reprehenderit aut repellendus est corrupti veniam molestiae perferendis nam officiis in repudiandae tempore mollitia. Facilis, culpa assumenda.',
      date: new Date().toLocaleString('pt-BR'),
      mine: true
    }
  ])

  const { selectedTicket, setSelectedTicket } = dashboard.useData()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm()

  function createTicketMessage(data: FormData) {
    try {
      setLoading(true)
      if (!data.Content || data.Content === '') {
        throw new Error('Cannot create a empty message')
      }
      setMessages([
        ...messages,
        {
          date: new Date().toLocaleString('pt-BR'),
          mine: true,
          text: data.Content
        }
      ])
    } catch (err) {
      utils.showError(err)
    } finally {
      setLoading(false)
    }
  }

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
                Ticket {selectedTicket?.ticketId}
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

          <p className="text-sm">{selectedTicket?.message}</p>
        </common.Card>

        {messages.map((message) => (
          <div
            className={`p-4 rounded-lg ${
              message.mine
                ? '!rounded-tr-none dark:bg-menu-primary bg-white'
                : '!rounded-tl-none dark:bg-menuItem-primary bg-green-50'
            }`}
            key={message.date}
          >
            <p className="dark:text-white">{message.text}</p>
            <p className="mt-1 text-xs dark:text-gray-400">{message.date}</p>
          </div>
        ))}
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
