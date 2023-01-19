import * as utils from 'utils'

export async function getTicketData({
  ticket
}: {
  ticket:
    | {
        userid?: undefined
      }
    | {
        userid: any
      }
}) {
  return utils.localApi.get(utils.apiRoutes.local.support.ticket, {
    params: ticket
  })
}
