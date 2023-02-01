import * as utils from 'utils'

export async function getEntity({
  name,
  accessToken,
  selectedEntity
}: {
  name: string
  accessToken: string
  selectedEntity: string
}) {
  return utils.api.get(`${utils.apiRoutes.entity(name)}/${selectedEntity}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}
