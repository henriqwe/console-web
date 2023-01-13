import * as utils from 'utils'

export async function createEntitySchema({
  name,
  accessToken,
  entityName,
  attributes
}: {
  name: string
  accessToken: string
  entityName: string
  attributes: {
    name: any
    type: any
    comment: any
    nullable: any
    length: any
  }[]
}) {
  return utils.api.post(
    utils.apiRoutes.entity(entityName as string),
    {
      name: name,
      attributes: attributes,
      associations: []
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
  )
}
