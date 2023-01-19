import * as utils from 'utils'

export async function updateAssociation({
  name,
  accessToken,
  projectName,
  selectedEntity,
  attribute
}: {
  name: string
  accessToken: string
  projectName: string
  selectedEntity: string
  attribute: string
}) {
  return utils.api.put(
    `${utils.apiRoutes.association({
      projectName: projectName,
      entityName: selectedEntity
    })}/${attribute}`,
    {
      name: name
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
  )
}
