import * as common from 'common'
import * as utils from 'utils'
import * as services from 'services'
import * as dashboard from 'domains/dashboard'
import { PlusIcon, ReplyIcon } from '@heroicons/react/outline'
import { useEffect } from 'react'
import { RowActions } from './RowActions'
import { TicketDetail } from './TicketDetail'
import { useUser } from 'contexts/UserContext'

export function HelpAndSupport() {
  const { user } = useUser()
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
      const ticket =
        user?.userData.email === process.env.NEXT_PUBLIC_SUPPORT_EMAIL
          ? {}
          : {
              userid: user?.userData.id
            }

      const { data } = await services.ycodify.getTicketData({ ticket: ticket })

      const tmpTickets = data?.[0]?.ticket ?? []

      //tickets ativos mais antigos primeiro
      const sortedTickets = tmpTickets.sort((a: any, b: any) => {
        const aDate = new Date(a.date)
        const bDate = new Date(b.date)

        return a.status !== 'Active'
          ? 1
          : b.status !== 'Active'
          ? -1
          : aDate.getTime() - bDate.getTime()
      })

      setTickets(sortedTickets)
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
                  user?.email !== process.env.NEXT_PUBLIC_SUPPORT_EMAIL && (
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
                  )
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
            <TicketDetail
              user={{
                id: user?.userData.id,
                email: user?.userData.email,
                username: user?.userData.username
              }}
            />
          ) : (
            <common.Table
              tableColumns={[
                { name: 'id', displayName: 'Ticket Id' },
                {
                  name: 'title',
                  displayName: 'Title'
                },
                {
                  name: 'project',
                  displayName: 'Project'
                },
                {
                  name: 'category',
                  displayName: 'Category'
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
