import * as utils from 'utils'

export async function createSchema({
  projectName,
  accessToken
}: {
  projectName: string
  accessToken: string
}) {
  return utils.api.post(
    utils.apiRoutes.schemas,
    {
      name: projectName
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
  )
}
