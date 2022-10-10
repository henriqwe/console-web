import * as common from 'common'
import * as utils from 'utils'
import * as dashboard from 'domains/dashboard'
import { PlusIcon, ReplyIcon } from '@heroicons/react/outline'
import { useEffect } from 'react'
import { RowActions } from './RowActions'
import { TicketDetail } from './TicketDetail'

export function HelpAndSupport() {
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
      const result = await fetch(
        'https://api.ycodify.com/v0/persistence/s/no-ac',
        {
          method: 'POST',
          body: JSON.stringify({
            action: 'READ',
            data: [
              {
                tickets: {}
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

      setTickets(data?.[0]?.tickets ?? [])
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
          <div className="flex flex-col">
            <common.Breadcrumb
              pages={[
                { content: 'Help and support', current: false },
                { content: '', current: false }
              ]}
            />
            <div className="flex">
              <h1 className="pr-4 text-2xl font-semibold text-gray-900 dark:text-white">
                Ticket
              </h1>
              <div className="flex items-center">
                {!selectedTicket ? (
                  <button
                    className="px-1 py-1 bg-white rounded-md"
                    onClick={() => {
                      setOpenSlide(true)
                      setSlideType('createTicket')
                      setSlideSize('normal')
                      // router.push(routes.createProject)
                    }}
                  >
                    <div className="flex items-center gap-2 dark:text-primary">
                      <p className="text-xs ">Create</p>
                      <PlusIcon className="w-3 h-3" />
                    </div>
                  </button>
                ) : (
                  <button
                    className="px-1 py-1 bg-gray-600 rounded-md"
                    onClick={() => {
                      setSelectedTicket(undefined)
                    }}
                  >
                    <div className="flex items-center gap-2 text-gray-300 dark:text-primary">
                      <ReplyIcon className="w-3 h-3" />
                      <span className="text-xs ">Back</span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col w-full gap-8 mx-auto">
          {selectedTicket ? (
            <TicketDetail />
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
