import * as utils from 'utils'

export async function updateEntityName({
  projectName,
  Name,
  selectedEntity,
  accessToken
}: {
  projectName: string
  Name: string
  selectedEntity: string

  accessToken: string
}) {
  return utils.api.put(
    `${utils.apiRoutes.entity(projectName)}/${selectedEntity}`,
    {
      name: Name,
      _conf: {}
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
  )
}
