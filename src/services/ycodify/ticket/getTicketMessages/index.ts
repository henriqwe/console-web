import * as utils from 'utils'

export async function getTicketMessages({ ticketid }: { ticketid: number }) {
  return utils.localApi.get(`${utils.apiRoutes.local.support.message}`, {
    params: {
      ticketid: ticketid
    }
  })
}
