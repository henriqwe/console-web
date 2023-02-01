import * as utils from 'utils'

export async function deleteEntity({
  name,
  accessToken,
  selectedEntity
}: {
  name: string
  accessToken: string
  selectedEntity: string
}) {
  return utils.api.delete(`${utils.apiRoutes.entity(name)}/${selectedEntity}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${accessToken}`
    }
  })
}
