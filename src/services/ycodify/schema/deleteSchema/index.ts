import * as utils from 'utils'

export async function deleteSchema({
  selectedSchema,
  accessToken
}: {
  selectedSchema: string
  accessToken: string
}) {
  return utils.api.delete(`${utils.apiRoutes.schemas}/${selectedSchema}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}
