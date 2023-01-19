import * as utils from 'utils'

export async function getSchema({
  name,
  accessToken
}: {
  name: string
  accessToken: string
}) {
  return utils.api.get(`${utils.apiRoutes.schemas}/${name as string}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}
