import * as utils from 'utils'

export async function createTicket({
  date,
  category,
  content,
  title,
  userid,
  status,
  project
}: {
  date: string
  category: string
  content: string
  title: string
  status: string
  userid: string
  project: string
}) {
  return utils.localApi.post(utils.apiRoutes.local.support.ticket, {
    ticket: {
      project: project,
      userid: userid,
      title: title,
      content: content,
      category: category,
      status: status,
      date: date
    }
  })
}
