import * as utils from 'utils'

export async function deleteAttribute({
  accessToken,
  projectName,
  entityName,
  name
}: {
  accessToken: string
  projectName: string
  entityName: string
  name: string
}) {
  return utils.api.delete(
    `${utils.apiRoutes.attribute({
      projectName: projectName,
      entityName: entityName as string
    })}/${name}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
  )
}
