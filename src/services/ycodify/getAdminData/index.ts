import * as utils from 'utils'

export async function getAdminData({
  username,
  password
}: {
  username: string
  password: string
}) {
  return utils.api.post(
    utils.apiRoutes.roles,
    {
      username: username,
      password: password
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}
