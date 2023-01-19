import * as utils from 'utils'

export async function updatePublishSchema({
  name,
  accessToken,
  status
}: {
  name: string
  accessToken: string
  status: number
}) {
  return utils.api.put(
    `${utils.apiRoutes.schemas}/${name}`,
    { status: status },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${accessToken}`
      }
    }
  )
}
