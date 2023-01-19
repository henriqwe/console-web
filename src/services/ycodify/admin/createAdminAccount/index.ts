import * as utils from 'utils'

export async function createAdminAccount({
  projectName,
  accessToken
}: {
  projectName: string
  accessToken: string
}) {
  return utils.api.post(
    utils.apiRoutes.createAdminAccount(projectName),
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
  )
}
