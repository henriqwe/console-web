import * as common from 'common'
import * as utils from 'utils'
import * as dashboard from 'domains/dashboard'
import { PlusIcon, ReplyIcon } from '@heroicons/react/outline'
import { useEffect, useState } from 'react'
import { RowActions } from './RowActions'
import { TicketDetail } from './TicketDetail'
import axios from 'axios'

type User = {
  email: string
  id: number
  username: string
}

export function HelpAndSupport() {
  const [user, setUser] = useState<User>()
  const {
    setOpenSlide,
    setSlideType,
    setSlideSize,
    reload,
    tickets,
    setTickets,
    selectedTicket,
    setSelectedTicket
  } = dashboard.useData()

  async function loadTickets() {
    try {
      const { data } = await axios.get(
        'https://api.ycodify.com/v0/id/account/get',
        {
          headers: {
            Authorization: `Bearer ${utils.getCookie('access_token')}`
          }
        }
      )
      let tickets: any = {
        userid: data.id
      }

      if (data.email === 'suporte@ycodify.com') {
        tickets = {}
      }
      const result = await fetch(
        'https://api.ycodify.com/v0/persistence/s/no-ac',
        {
          method: 'POST',
          body: JSON.stringify({
            action: 'READ',
            data: [
              {
                tickets: {
                  ...tickets
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

      const response = await result.json()

      setUser(data)
      setTickets(response?.[0]?.tickets ?? [])
    } catch (err) {
      utils.showError(err)
    }
  }
  useEffect(() => {
    loadTickets()
  }, [reload])

  return (
    <div className="flex justify-center">
      <div className="absolute inset-x-0 top-0 z-10 flex justify-center pointer-events-none blur-xl">
        <div className="flex justify-end flex-none w-full">
          <img
            src="/assets/images/green-blur-test.png"
            alt=""
            className="w-[71.75rem] flex-none max-w-none"
          />
        </div>
      </div>
      <div className="z-20 flex flex-col w-full gap-y-6">
        <section className="flex justify-between w-full mx-auto">
          <div className="flex w-full flex-col">
            <common.Breadcrumb
              pages={[
                { content: 'Help and support', current: false },
                { content: '', current: false }
              ]}
            />
            <div className="flex w-full justify-between">
              <h1 className="pr-4 text-2xl font-semibold text-gray-900 dark:text-white">
                Ticket
              </h1>
              <div className="flex items-center">
                {!selectedTicket ? (
                  <common.Buttons.White
                    onClick={() => {
                      setOpenSlide(true)
                      setSlideType('createTicket')
                      setSlideSize('normal')
                      // router.push(routes.createProject)
                    }}
                    icon={<PlusIcon className="w-3 h-3" />}
                  >
                    <p className="text-xs">Create</p>
                  </common.Buttons.White>
                ) : (
                  <common.Buttons.White
                    onClick={() => {
                      setSelectedTicket(undefined)
                    }}
                    icon={<ReplyIcon className="w-3 h-3" />}
                  >
                    <p className="text-xs">Back</p>
                  </common.Buttons.White>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col w-full gap-8 mx-auto">
          {selectedTicket ? (
            <TicketDetail user={user} />
          ) : (
            <common.Table
              tableColumns={[
                { name: 'id', displayName: 'Ticket Id' },
                {
                  name: 'project',
                  displayName: 'Project'
                },
                {
                  name: 'category',
                  displayName: 'Category'
                },
                {
                  name: 'title',
                  displayName: 'Title'
                },
                {
                  name: 'status',
                  displayName: 'Status'
                }
              ]}
              values={tickets}
              actions={({ item }) => <RowActions item={item} />}
              notFoundMessage="No tickets to display"
              rounded
            />
          )}
        </section>
      </div>

      <div className="z-20">
        <dashboard.SlidePanel />
      </div>
    </div>
  )
}
