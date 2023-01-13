import * as utils from 'utils'

export async function getEntityList({
  name,
  accessToken
}: {
  name: string
  accessToken: string
}) {
  return utils.api.get(`${utils.apiRoutes.entityList(name)}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}
