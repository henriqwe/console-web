import * as utils from 'utils'

export async function createAttribute({
  projectName,
  entityName,
  ColumnName,
  Comment,
  Nullable,
  Type,
  Length,
  accessToken
}: {
  projectName: string
  entityName: string
  ColumnName: string
  Comment: string
  Nullable: boolean
  Type: string
  Length: string
  accessToken: string
}) {
  return utils.api.post(
    utils.apiRoutes.attribute({
      projectName: projectName,
      entityName: entityName
    }),
    {
      name: ColumnName,
      comment: Comment,
      isNullable: Nullable,
      length: Length,
      type: Type
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
  )
}
