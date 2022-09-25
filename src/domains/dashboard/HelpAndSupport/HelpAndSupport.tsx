import * as common from 'common'
import * as dashboard from 'domains/dashboard'
import { PlusIcon } from '@heroicons/react/outline'
import { useEffect } from 'react'
import { RowActions } from './RowActions'
import { TicketDetail } from './TicketDetail'

type Tickets = {
  ticketId: string
  project: string
  category: string
  title: string
  status: string
}

export function HelpAndSupport() {
  const {
    setOpenSlide,
    setSlideType,
    setSlideSize,
    reload,
    tickets,
    selectedTicket
  } = dashboard.useData()

  async function loadTickets() {
    // try {
    //   const { data } = await utils.api.get(utils.apiRoutes.schemas, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Accept: 'application/json',
    //       Authorization: `Bearer ${utils.getCookie('access_token')}`
    //     }
    //   })
    //   setSchemas(data)
    // } catch (err: any) {
    //   if (err.response.status !== 404) {
    //     utils.showError(err)
    //   }
    // }
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
      <div className="z-20 flex flex-col w-4/6 gap-y-8">
        <section className="flex justify-between w-full mx-auto">
          <div className="flex flex-col">
            <p className="text-xs dark:text-gray-500">
              Help and support <span className="ml-1"> {'>'} </span>
            </p>
            <div className="flex">
              <h1 className="pr-4 text-2xl font-semibold text-gray-900 dark:text-white">
                Ticket
              </h1>
              <div className="flex items-center">
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
                { name: 'ticketId', displayName: 'Ticket Id' },
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
