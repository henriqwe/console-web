import * as utils from 'utils'

export async function deleteAssociation({
  type,
  accessToken,
  projectName,
  selectedEntity,
  attribute
}: {
  type: string
  accessToken: string
  projectName: string
  selectedEntity: string
  attribute: string
}) {
  return utils.api.delete(
    `${utils.apiRoutes.association({
      projectName: projectName,
      entityName: selectedEntity
    })}/${attribute}/type/${type}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
  )
}
