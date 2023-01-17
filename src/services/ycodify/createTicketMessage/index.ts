import * as utils from 'utils'

export async function createTicketMessage({
  date,
  createdbyuser,
  content,
  ticketid,
  ticket
}: {
  date: string
  createdbyuser: boolean
  content: string
  ticketid: number
  ticket: number
}) {
  return utils.localApi.post(utils.apiRoutes.local.support.message, {
    message: {
      date: date,
      createdbyuser: createdbyuser,
      content: content,
      ticketid: ticketid,
      ticket: ticket
    }
  })
}
