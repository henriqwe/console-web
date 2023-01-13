import * as utils from 'utils'

export async function createAssociation({
  name,
  accessToken,
  projectName,
  selectedEntity,
  type,
  Nullable,
  Comment
}: {
  name: string
  accessToken: string
  projectName: string
  selectedEntity: string
  type: string
  Nullable: boolean
  Comment: string
}) {
  return utils.api.post(
    utils.apiRoutes.association({
      projectName: projectName,
      entityName: selectedEntity as string
    }),
    {
      name: name,
      type: type,
      nullable: Nullable,
      comment: Comment
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
  )
}
